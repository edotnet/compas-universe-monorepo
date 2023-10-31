import { serializeMap } from './mapSerializer';
import { AsyncContext } from '@nestjs-steroids/async-context';

export class CustomSerializer<TInput = any, TOutput = any> {
    constructor() {
    }

    serialize(value: any): any {
        let reqUserId = '';
        if (value.data.user) {
            value.data.user = serializeMap(value.data.user);
            reqUserId = value.data.user.id;
        }
        if (value.data.coins) {
            value.data.coins = serializeMap(value.data.coins);
        }
        let asyncHook: AsyncContext = AsyncContext.getInstance();
        let reqId = '';
        try {
            reqId = asyncHook.get('reqId');
            let userId = asyncHook.get('reqUserId');
            if (userId) {
                reqUserId = userId;
            }
        } catch (e) {
        }
        value.data.reqId = reqId;
        value.data.reqUserId = reqUserId;
        return value;
    }
}
