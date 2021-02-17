import { RedisContext } from '../../infra/databases/redis/RedisContext';
import { JWTToken, RefreshToken } from './TokenAlias';
import { User } from '../../../modules/user/domain/aggregateRoot/User';
import { Inject, Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { uid } from 'rand-token';

interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    email: string;
}

export interface IJwtAuthService {
    signJWT(user: User): JWTToken;
    decodeJWT(token: JWTToken): IJwtPayloadExtend;
    createRefreshToken(): RefreshToken;
    getToken(user: User): Promise<string>
    getTokens(email: string): Promise<string[]>
    addToken(user: User): Promise<any>
}

@Service('redis.auth.service')
export class RedisAuthService implements IJwtAuthService {
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    public jwtHashName = 'activeJwtClients'
    
    public signJWT(user: User): JWTToken {
        return jwt.sign({
            email: user.email.value
        }, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            subject: user.id.toString(),
            expiresIn: 24 * 60 * 60,
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithm: 'HS256'
        } as jwt.SignOptions);
    }

    public decodeJWT(token: JWTToken): IJwtPayloadExtend  {
        return jwt.verify(token, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithms: 'HS256'
        } as unknown as jwt.VerifyOptions) as IJwtPayloadExtend
    }

    public createRefreshToken(): RefreshToken {
        return uid(256) as RefreshToken
    }

    public async saveAuthenticatedUser(user: User): Promise<void> {
        if(user.isLogin())
            await this.addToken(user)
    }

    public addToken(user: User): Promise<any> {
        const constructKey = this.constructKey(user.refreshToken, user.email.value)
        return this._redisContext.set(constructKey, user.accessToken)
    }

    public getToken(user: User): Promise<string> {
        return this._redisContext.getOne(this.constructKey(user.refreshToken, user.email.value))
    }

    async getTokens(email: string): Promise<string[]> {
        const keyValues = await this._redisContext.getAllKeyValue(`*${this.jwtHashName}.${email}`)
        return keyValues.map((kv) => kv.value)
    }

    private constructKey(refreshToken: RefreshToken, email: string): string {
        return `refresh-${refreshToken}.${this.jwtHashName}.${email}`
    }
}
