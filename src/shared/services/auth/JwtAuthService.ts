import { User } from '../../../modules/user/domain/aggregateRoot/User';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

interface IJwtPayloadExtend extends IJwtPayload {
    roleId: string;
}

interface IJwtAuthService {
    sign(user: User): string;
    verify(token: string): IJwtPayloadExtend;
}

@Service('jwt.auth.service')
export class JwtAuthService implements IJwtAuthService {
    sign(user: User): string {
        return jwt.sign({
        }, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            subject: user.id.toString(),
            expiresIn: 24 * 60 * 60,
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithm: 'HS256'
        } as jwt.SignOptions);
    }

    verify(token: string): IJwtPayloadExtend {
        return jwt.verify(token, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
            issuer: 'node-core',
            audience: `${'http'}://${'localhost'}`,
            algorithms: 'HS256'
        } as unknown as jwt.VerifyOptions) as IJwtPayloadExtend
    }
}