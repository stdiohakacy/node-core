import { JWTToken, RefreshToken } from './../../alias/TokenAlias';
import { User } from '../../../modules/user/domain/aggregateRoot/User';

interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: string;
}

export interface IJwtAuthService {
    signJWT(user: User): JWTToken;
    decodeJWT(token: JWTToken): IJwtPayloadExtend;
    createRefreshToken(): RefreshToken;
    getToken(user: User): Promise<string>
}
