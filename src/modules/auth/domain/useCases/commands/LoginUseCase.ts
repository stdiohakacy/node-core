import { Inject, Service } from 'typedi';
import { RedisAuthService } from '../../../../../shared/services/auth/RedisAuthService';
import { left, Result, right } from '../../../../../shared/core/Result';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { LoginResponse } from '../response/LoginResponse';
import { UserStatusType } from '../../../../user/domain/blocks/enums/UserStatusType';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserRepository } from '../../../../user/infra/repositories/UserRepository';
import { UserEmail } from '../../../../user/domain/blocks/valueObject/UserEmail';
import { UserPassword } from '../../../../user/domain/blocks/valueObject/UserPassword';
import { LoginErrors } from '../errors/LoginErrors';
import { LoginCommandDTO } from '../request/LoginCommandDTO';

@Service()
export class LoginUseCase implements IUseCaseCommandCQRS<LoginCommandDTO, Promise<LoginResponse>> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository;

    @Inject('redis.auth.service')
    private readonly _redisAuthService: RedisAuthService;
    
    async execute(param: LoginCommandDTO): Promise<LoginResponse> {
        const emailOrError = UserEmail.create({ value: param.email })
        const passwordOrError = UserPassword.create({ value: param.password })

        const dtoResults = Result.combine([
            emailOrError,
            passwordOrError,
        ])

        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))
        
        const email = emailOrError.getValue()
        const password = passwordOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)
            if(!user)
                return left(new LoginErrors.AccountInvalidError())
            const isPasswordValid = await user.password.comparePassword(password.value)
            if(user && !isPasswordValid)
                return left(new LoginErrors.AccountInvalidError())
            if(user.status.value === UserStatusType.INACTIVE)
                return left(new LoginErrors.AccountStatusError())
                
            const accessToken = this._redisAuthService.signJWT(user)
            const refreshToken = this._redisAuthService.createRefreshToken()
            user.setToken(accessToken, refreshToken)
            await this._redisAuthService.saveAuthenticatedUser(user);
            return right(Result.OK({ accessToken, refreshToken }));
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
