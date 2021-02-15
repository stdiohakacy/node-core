import { RedisContext } from './../../../shared/infra/databases/redis/RedisContext';
import { uid } from 'rand-token';
import { JWTToken, RefreshToken } from './../../../shared/alias/TokenAlias';
import { IJwtAuthService, IJwtPayloadExtend } from './../../../shared/services/auth/JwtAuthService';
import { User } from '../../user/domain/aggregateRoot/User';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';

@Service('redis.auth.service')
export class RedisAuthService implements IJwtAuthService {
    
    @Inject('redis.context')
    private readonly _redisContext: RedisContext;

    public jwtHashName = 'activeJwtClients'
    
    signJWT(user: User): JWTToken {
        return jwt.sign({
        }, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            subject: user.id.toString(),
            expiresIn: 24 * 60 * 60,
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithm: 'HS256'
        } as jwt.SignOptions);
    }

    decodeJWT(token: JWTToken): IJwtPayloadExtend {
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

    public constructKey(refreshToken: RefreshToken, email: string): string {
        return `refresh-${refreshToken}.${this.jwtHashName}.${email}`
    }

    public addToken(user: User): Promise<any> {
        const constructKey = this.constructKey(user.refreshToken, user.email.value)
        return this._redisContext.set(constructKey, user.accessToken)
    }

    public getToken(user: User): Promise<string> {
        return this._redisContext.getOne(this.constructKey(user.refreshToken, user.email.value))
    }
} 
