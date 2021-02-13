import { UserActiveExpire } from './../../../domain/valueObject/UserActiveExpire';
import { UserActiveKey } from './../../../domain/valueObject/UserActiveKey';
import { JwtAuthService } from './../../../../../shared/services/JwtAuthService';
import { Inject, Service } from 'typedi';
import { UserStatusType } from './../../../enums/UserStatusType';
import { User } from './../../../domain/aggregateRoot/User';
import { UserEmail } from './../../../domain/valueObject/UserEmail';
import { SignUpUserResponse } from './SignUpUserResponse';
import { SignUpUserCommandDTO } from './SignUpUserCommandDTO';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { UserRepository } from '../../../repositories/UserRepository';
import { UserStatus } from '../../../domain/valueObject/UserStatus';
import { UserFirstName } from '../../../domain/valueObject/UserFirstName';
import { UserLastName } from '../../../domain/valueObject/UserLastName';
import { UserPassword } from '../../../domain/valueObject/UserPassword';
import { left, Result, right } from '../../../../../shared/core/Result';
import { SignUpUserErrors } from './SignUpUserErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserMapper } from '../../../infra/UserMapper';
import { addSeconds } from '../../../../../shared/libs/date';
import { randomBytes } from 'crypto';


@Service()
export class SignUpUserUseCase implements IUseCaseCommandCQRS<SignUpUserCommandDTO, Promise<SignUpUserResponse>> {
    @Inject('user.repository')
    private _userRepository: UserRepository;
    
    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: JwtAuthService;

    async execute(param: SignUpUserCommandDTO): Promise<SignUpUserResponse> {
        const firstNameOrError = UserFirstName.create({ value: param.firstName })
        const lastNameOrError = UserLastName.create({ value: param.lastName })
        const emailOrError = UserEmail.create({ value: param.email })
        const passwordOrError = UserPassword.create({ value: param.password })
        const statusOrError = UserStatus.create({ value: UserStatusType.INACTIVE })
        const activeKeyOrError = UserActiveKey.create({value: randomBytes(32).toString('hex')})
        const activeExpireOrError = UserActiveExpire.create({ value: addSeconds(new Date(), 3 * 24 * 60 * 60 ) })

        const dtoResults = Result.combine([
            firstNameOrError,
            lastNameOrError,
            emailOrError,
            passwordOrError,
            statusOrError,
            activeKeyOrError,
            activeExpireOrError
        ])

        if(dtoResults.isFailure) {
            return left(Result.fail(dtoResults.error))
        }

        const firstName = firstNameOrError.getValue()
        const lastName = lastNameOrError.getValue()
        const email = emailOrError.getValue()
        const password  = passwordOrError.getValue()
        const status = statusOrError.getValue()
        const activeKey = activeKeyOrError.getValue()
        const activeExpire = activeExpireOrError.getValue()

        try {
            const isExist = await this._userRepository.isEmailExist(email)
            if(isExist)
                return left(new SignUpUserErrors.EmailAlreadyExistsError(email.value))
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        const userOrError = User.create({
            firstName,
            lastName,
            email, 
            password,
            status,
            activeKey,
            activeExpire
        })

        if(userOrError.isFailure)
            return left(Result.fail(userOrError.error.toString()))

        const user = userOrError.getValue()
        const userDb = await UserMapper.toPersistence(user)
        
        try {
            const user = await this._userRepository.createGet(userDb)
            if(!user)
                return left(new SignUpUserErrors.DataCannotSave())
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        const accessToken = this._jwtAuthService.sign(user)
        return right(Result.OK(accessToken))
    }
}
