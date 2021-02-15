import { JwtAuthService } from './../../../../../shared/services/auth/JwtAuthService';
import { left, Result, right } from './../../../../../shared/core/Result';
import { UserEmail } from './../../../../user/domain/valueObject/UserEmail';
import { Inject, Service } from 'typedi';
import { LoginCommandDTO } from './LoginCommandDTO';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { LoginResponse } from './LoginResponse';
import { UserPassword } from '../../../../user/domain/valueObject/UserPassword';
import { AuthRepository } from '../../../repositories/AuthRepository';
import { LoginErrors } from './LoginErrors';
import { UserStatusType } from '../../../../user/enums/UserStatusType';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserRepository } from '../../../../user/repositories/UserRepository';

@Service()
export class LoginUseCase implements IUseCaseCommandCQRS<LoginCommandDTO, Promise<LoginResponse>> {
    @Inject('user.repository')
    private _userRepository: UserRepository;

    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: JwtAuthService;
    
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
                
            const accessToken = this._jwtAuthService.sign(user)
            return right(Result.OK(accessToken)) 
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
