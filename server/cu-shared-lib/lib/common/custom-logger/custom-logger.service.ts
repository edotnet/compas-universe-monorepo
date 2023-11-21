import { Inject, Injectable } from "@nestjs/common";
import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from "nestjs-pino";
import { AsyncContext } from "@nestjs-steroids/async-context";
import * as util from "util";

type LoggerFn =
  | ((msg: string, ...args: any[]) => void)
  | ((obj: object, msg?: string, ...args: any[]) => void);

@Injectable()
export class CustomLoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
    private readonly asyncHook: AsyncContext
  ) {
    super({
      pinoHttp: {
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        prettyPrint:
          process.env.NODE_ENV === "development"
            ? {
                colorize: true,
                levelFirst: true,
                translateTime: true,
              }
            : false,
      },
    });
  }

  trace(msg: string, ...args: any[]): void;
  trace(obj: object, msg?: string, ...args: any[]): void;
  trace(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .trace({ msg: util.inspect(args, false, 3) });
  }

  debug(msg: string, ...args: any[]): void;
  debug(obj: object, msg?: string, ...args: any[]): void;
  debug(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .debug({ msg: util.inspect(args, false, 3) });
  }

  info(msg: string, ...args: any[]): void;
  info(obj: object, msg?: string, ...args: any[]): void;
  info(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .info({ msg: util.inspect(args, false, 3) });
  }

  warn(msg: string, ...args: any[]): void;
  warn(obj: object, msg?: string, ...args: any[]): void;
  warn(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .warn({ msg: util.inspect(args, false, 3) });
  }

  error(msg: string, ...args: any[]): void;
  error(obj: object, msg?: string, ...args: any[]): void;
  error(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .error({ msg: util.inspect(args, false, 3) });
  }

  fatal(msg: string, ...args: any[]): void;
  fatal(obj: object, msg?: string, ...args: any[]): void;
  fatal(...args: Parameters<LoggerFn>) {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    let reqUserId = "";
    try {
      reqUserId = this.asyncHook.get("reqUserId");
    } catch (e) {}
    this.logger
      .child({ reqId, reqUserId })
      .fatal({ msg: util.inspect(args, false, 3) });
  }

  getReqId(): string {
    let reqId = "";
    try {
      reqId = this.asyncHook.get("reqId");
    } catch (e) {}
    return reqId;
  }
}
