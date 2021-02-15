import { RedisClient } from 'redis';
import * as redis from 'redis';

export class RedisContext {
    private _redisClient: RedisClient

    constructor(redisClient?: RedisClient) {
        if(redisClient) 
            this._redisClient = redisClient
    }

    get redisClient(): RedisClient {
        if(!this._redisClient)
            console.log('The redis connection is not exists!')
        return this.redisClient
    }

    createConnection(redisLib = redis): RedisClient {
        if(this._redisClient && this._redisClient.connected)
            return this._redisClient
        this._redisClient = redisLib.createClient({
            host: 'localhost',
            port: 6379
        } as redis.ClientOpts) as RedisClient
        return this._redisClient
    }
}
