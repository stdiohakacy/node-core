import { UserEmail } from './../../../domain/valueObject/UserEmail';
import { RefreshTokenUserResponse } from './RefreshTokenUserResponse';
import { RefreshTokenUserCommandDTO } from './RefreshTokenUserCommandDTO';
import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { RedisAuthService } from "../../../../../shared/services/auth/RedisAuthService";
import { UserRepository } from "../../../repositories/UserRepository";
import { RefreshTokenUserErrors } from './RefreshTokenUserErrors';

@Service()
export class RefreshTokenUserUseCase implements IUseCaseCommandCQRS<
    RefreshTokenUserCommandDTO,
    Promise<RefreshTokenUserResponse>
> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository
    @Inject('redis.auth.service')
    private readonly _redisAuthService: RedisAuthService;

    async execute(param: RefreshTokenUserCommandDTO): Promise<RefreshTokenUserResponse> {
        try {
            const email = await this._redisAuthService.getEmailFromRefreshToken(param.refreshToken)
            if (email === 'EmailNotFoundError')
                return left(new RefreshTokenUserErrors.EmailNotFoundFromRedisError())

            const emailOrError = UserEmail.create({ value: email })
            if (emailOrError.isFailure)
                return left(Result.fail(emailOrError.error))

            const emailValue = emailOrError.getValue()
            try {
                const user = await this._userRepository.getByEmail(emailValue)
                if (!user)
                    return left(new RefreshTokenUserErrors.UserNotFoundError())

                const accessToken = await this._redisAuthService.signJWT(user)
                user.setToken(accessToken, param.refreshToken)
                await this._redisAuthService.saveAuthenticatedUser(user)
                return right(Result.OK(accessToken))
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError())
            }
        } catch (error) {
            console.error(error)
            return left(new RefreshTokenUserErrors.TokenNotFoundError())
        }
    }
}
