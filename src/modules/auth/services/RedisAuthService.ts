import { JWTToken } from './../../../shared/alias/TokenAlias';
import { IJwtAuthService, IJwtPayloadExtend } from './../../../shared/services/auth/JwtAuthService';
import { AbsRedisClient } from "../../../shared/infra/databases/redis/AbsRedisClient";
import { User } from '../../user/domain/aggregateRoot/User';
import { RedisClient } from 'redis';
import * as jwt from 'jsonwebtoken';

export class RedisAuthService extends AbsRedisClient implements IJwtAuthService {
    constructor(redisClient: RedisClient) {
        super(redisClient)
    }
    sign(user: User): JWTToken {
        return jwt.sign({
        }, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            subject: user.id.toString(),
            expiresIn: 24 * 60 * 60,
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithm: 'HS256'
        } as jwt.SignOptions);
    }
    decode(token: JWTToken): IJwtPayloadExtend {
        return jwt.verify(token, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithms: 'HS256'
        } as unknown as jwt.VerifyOptions) as IJwtPayloadExtend
    }
} 
