import { Result, right } from './../../../../../shared/core/Result';
import { RedisAuthService } from './../../../../../shared/services/auth/RedisAuthService';
import { AuthenticateResponse, UserAuthenticated } from './AuthenticateResponse';
import { AuthenticateCommandDTO } from './AuthenticateCommandDTO';
import { IUseCaseCommandCQRS } from './../../../../../shared/core/IUseCase';
import { Inject, Service } from "typedi";
import { left } from '../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { AuthenticateErrors } from './AuthenticateErrors';

@Service()
export class AuthenticateUseCase implements IUseCaseCommandCQRS<AuthenticateCommandDTO, Promise<AuthenticateResponse>> {
    @Inject('redis.auth.service')
    private readonly _redisAuthService: RedisAuthService;

    async execute(param: AuthenticateCommandDTO): Promise<AuthenticateResponse> {
        if(!param.token)
            return left(new AuthenticateErrors.TokenInvalidError())
        if(!validator.isJWT(param.token))
            return left(new AuthenticateErrors.TokenInvalidError())
        let payload
        try {
            payload = await this._redisAuthService.decodeJWT(param.token)
        } catch (error) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@')
            console.log(error.name)
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@')

            if(error.name === 'TokenExpiredError')
                return left(new AuthenticateErrors.TokenExpireTimeError())
            else
                return left(new AuthenticateErrors.TokenInvalidError())
        }

        if(!payload || !payload.sub)
            return left(new AuthenticateErrors.TokenInvalidError())

        return right(Result.OK(new UserAuthenticated(param.token, payload.sub, payload.email)))
    }
}
