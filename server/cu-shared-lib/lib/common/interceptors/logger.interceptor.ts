import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { AsyncContext } from "@nestjs-steroids/async-context";
import { CustomLoggerService } from "../custom-logger/custom-logger.service";
import { RmqContext } from "@nestjs/microservices";
import { tap } from "rxjs/operators";
import { GET_USER_BY_ID } from "../../message-patterns/users";

const ignoreMessagePatterns = [GET_USER_BY_ID];

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly asyncHook: AsyncContext,
    private readonly logger: CustomLoggerService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const c = context.switchToHttp();
    const data = c.getRequest();
    if (data && data.headers) {
      this.logger.logger.info("REQUEST url: " + data.url);
      return next.handle();
    }
    if (!data) {
      this.logger.info("data is undefined in request");
      return next.handle();
    }

    const { user, ...req } = data;

    let message = "UNKNOWN";
    try {
      message = (context.switchToHttp()["args"][1] as RmqContext).getPattern();
    } catch (e) {}
    this.asyncHook.register();
    const reqId = data["reqId"];
    const reqUserId = data["reqUserId"];
    this.asyncHook.set("reqId", reqId);
    this.asyncHook.set("reqUserId", reqUserId);
    delete req.reqId;
    delete req.reqUserId;
    if (req.eventId) {
      if (!ignoreMessagePatterns.includes(message)) {
        this.logger.info({
          eventId: req.eventId,
          message: this.sanitizeRequest(req),
        });
      }
      return next.handle().pipe(
        tap((data) => {
          if (!ignoreMessagePatterns.includes(message)) {
            this.logger.info({
              eventId: req.eventId,
              message: this.sanitizeResponse(req),
              success: true,
            });
          }
        })
      );
    }

    if (!ignoreMessagePatterns.includes(message)) {
      this.logger.info({
        message,
        reqId,
        reqUserId,
        req: this.sanitizeRequest(req),
      });
    }
    return next.handle().pipe(
      tap((data) => {
        if (!ignoreMessagePatterns.includes(message)) {
          this.logger.info({
            message,
            reqId,
            reqUserId,
            res: this.sanitizeResponse(data),
          });
        }
      })
    );
  }

  sanitizeRequest(o) {
    const obj = { ...o };
    try {
      for (let k in obj) {
        if (k === "parent") {
          continue;
        }
        if (k === "file") {
          obj[k] = null;
        } else if (typeof obj[k] == "object" && obj[k] !== null) {
          if (typeof obj[k] === "string" || obj[k] instanceof String) {
            if (k.toLowerCase().includes("password")) {
              obj[k] = "SANITIZED_PASSWORD";
            }
          } else {
            obj[k] = this.sanitizeRequest(obj[k]);
          }
        } else {
          if (typeof obj[k] === "string" || obj[k] instanceof String) {
            if (k.toLowerCase().includes("password")) {
              obj[k] = "SANITIZED_PASSWORD";
            }
          }
        }
      }
    } catch (e) {}
    return obj;
  }

  sanitizeResponse(o) {
    if (o instanceof Buffer) {
      return {};
    }
    const obj = { ...o };
    try {
      for (let k in obj) {
        if (k === "parent") {
          continue;
        }
        if (k === "photo") {
          obj[k] = null;
        } else if (k === "file") {
          obj[k] = null;
        } else if (typeof obj[k] == "object" && obj[k] !== null) {
          if (typeof obj[k] === "string" || obj[k] instanceof String) {
            if (k.toLowerCase().includes("password")) {
              obj[k] = "SANITIZED_PASSWORD";
            }
            if (k.toLowerCase().includes("photo")) {
              obj[k] = "SANITIZED_PASSWORD";
            }
          } else {
            obj[k] = this.sanitizeResponse(obj[k]);
          }
        } else {
          if (typeof obj[k] === "string" || obj[k] instanceof String) {
            if (k.toLowerCase().includes("password")) {
              obj[k] = "SANITIZED_PASSWORD";
            }
          }
        }
      }
    } catch (e) {
      console.log({ msg: "sanitizeResponse error" });
    }
    return obj;
  }
}
