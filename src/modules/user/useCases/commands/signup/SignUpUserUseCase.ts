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
import { UserDb } from '../../../infra/databases/typeorm/entities/UserDb';

@Service()
export class SignUpUserUseCase implements IUseCaseCommandCQRS<SignUpUserCommandDTO, Promise<SignUpUserResponse>> {
    @Inject('user.repository')
    private _userRepository: UserRepository;
    
    async execute(param: SignUpUserCommandDTO): Promise<SignUpUserResponse> {
        const firstNameOrError = UserFirstName.create({ value: param.firstName })
        const lastNameOrError = UserLastName.create({ value: param.lastName })
        const emailOrError = UserEmail.create({ value: param.email })
        const passwordOrError = UserPassword.create({ value: param.password })
        const statusOrError = UserStatus.create({ value: UserStatusType.ACTIVED})

        const dtoResults = Result.combine([
            firstNameOrError,
            lastNameOrError,
            emailOrError,
            passwordOrError
        ])

        if(dtoResults.isFailure)
            return left(Result.fail<void>(dtoResults.error)) as SignUpUserResponse

        const firstName: UserFirstName = firstNameOrError.getValue()
        const lastName: UserLastName = lastNameOrError.getValue()
        const email: UserEmail = emailOrError.getValue()
        const password : UserPassword = passwordOrError.getValue()
        const status: UserStatus = statusOrError.getValue()

        try {
            const isEmailExist = await this._userRepository.isEmailExist(email)
            if(isEmailExist)
                return left(new SignUpUserErrors.EmailAlreadyExistsError()) as SignUpUserResponse
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error)) as SignUpUserResponse
        }
        const userOrError: Result<User> = User.create({
            firstName, 
            lastName,
            email, 
            password, 
            status
        })

        if(userOrError.isFailure)
            return left(Result.fail<User>(userOrError.error.toString())) as SignUpUserResponse

        const user: User = userOrError.getValue()
        const userDb: UserDb = UserMapper.toPersistence(user)
        try {
            const id = await this._userRepository.create(userDb)
            if(!id)
                return left(new SignUpUserErrors.CannotSaveError()) as SignUpUserResponse

            return right(Result.OK<string>(id)) as SignUpUserResponse
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error)) as SignUpUserResponse
        }
    }
}
