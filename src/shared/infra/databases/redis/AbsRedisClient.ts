import { RedisClient } from 'redis'

export abstract class AbsRedisClient {
    private _tokenExpireTime: number = 604800;
    protected client: RedisClient;

    constructor(client: RedisClient) {
        this.client = client
    }

    public set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error, reply) => {
                if(error)
                    return reject(error)
                this.client.expire(key, this._tokenExpireTime)
                return resolve(reply)
            })
        })
    }

    public getOne<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error: Error, reply: unknown) => {
                if(error)
                    return reject(error)
                return resolve(<T>reply)
            })
        })
    }

    public deleteOne(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, reply) => {
                if(error)
                    return reject(error)
                return resolve(reply)
            })
        })
    }

    public async count(key: string): Promise<number> {
        const allKeys = await this.getAllKeys(key)
        return allKeys.length
    }

    public isExist(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return this.count(key)
                .then(count => resolve(count >= 1 ? true : false))
                .catch(error => reject(error))
        })
    }

    public getAllKeys(wildCard: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.client.keys(wildCard, (error: Error, results: string[]) => {
                if(error)
                    return reject(error)
                return resolve(results)
            })
        })
    }

    public getAllKeyValue(wildCard: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.client.keys(wildCard, async(error: Error, results: string[]) => {
                if(error)
                    return reject(error)
                const allResults = await Promise.all(
                    results.map(async key => {
                        const value = await this.getOne(key)
                        return { key, value }
                    })
                )
                return resolve(allResults)
            })
        })
    }
}
