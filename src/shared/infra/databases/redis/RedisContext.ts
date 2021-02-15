import * as redis from 'redis';
import { Service } from 'typedi';

export interface IRedisContext {
    count(key: string): Promise<number>;
    isExist(key: string): Promise<boolean>;
    getOne<T>(key: string): Promise<T>;
    getAllKeys(wildCard: string): Promise<string[]>;
    getAllKeyValue(wildCard: string): Promise<any[]>;
    set(key: string, value: any): Promise<any>;
    deleteOne (key: string): Promise<number>
}


@Service('redis.context')
export class RedisContext implements IRedisContext {
    private _connection: redis.RedisClient;
    private tokenExpireTime: number = 604800;

    constructor(connection?: redis.RedisClient) {
        if (connection) 
            this._connection = connection;
    }

    get redisClient(): redis.RedisClient {
        if (!this._connection)
            throw new Error(`The redis connection is not exists!`)
        return this._connection;
    }

    public createConnection(redisLib = redis): redis.RedisClient {
        if (this._connection && this._connection.connected)
            return this._connection;

        this._connection = redisLib.createClient({
            host: 'localhost',
            port: 6379,
        } as redis.ClientOpts) as redis.RedisClient;
        return this._connection;
    }

    public set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (error, reply) => {
                if (error)
                    return reject(error)
                else {
                    this.redisClient.expire(key, this.tokenExpireTime)
                    return resolve(reply)
                }
            });
        })
    }

    getOne<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (error: Error, reply: unknown) => {
                if (error)
                    return reject(error)
                return resolve(<T>reply);
            });
        })
    }

    count(key: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
    isExist(key: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    
    getAllKeys(wildCard: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }
    getAllKeyValue(wildCard: string): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    deleteOne(key: string): Promise<number> {
        throw new Error('Method not implemented.');
    }

    
}
