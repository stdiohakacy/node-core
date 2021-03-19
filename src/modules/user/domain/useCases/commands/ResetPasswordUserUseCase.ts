import { Inject, Service } from 'typedi';
import { right } from '../../../../../shared/core/Result';
import { UserRepository } from '../../../infra/repositories/UserRepository';
import { ResetPasswordUserResponse } from '../response/ResetPasswordUserResponse';
import {  ResetPasswordUserCommandDTO } from '../request/ResetPasswordUserCommandDTO';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result } from '../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserEmail } from '../../blocks/valueObject/UserEmail';
import { UserForgotKey } from '../../blocks/valueObject/UserForgotKey';
import { UserPassword } from '../../blocks/valueObject/UserPassword';
import { ResetPasswordUserErrors } from '../errors/ResetPasswordUserErrors';
import { UserDb } from '../../../../../infra/UserDb';

@Service()
export class ResetPasswordUserUseCase implements IUseCaseCommandCQRS<ResetPasswordUserCommandDTO, Promise<ResetPasswordUserResponse>> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    async execute(param: ResetPasswordUserCommandDTO): Promise<ResetPasswordUserResponse> {
        const emailOrError = UserEmail.create({ value: param.email })
        const forgotKeyOrError = UserForgotKey.create({ value: param.forgotKey })
        const passwordOrError = UserPassword.create({ value: param.password })

        const dtoResults = Result.combine([
            emailOrError,
            forgotKeyOrError,
            passwordOrError,
        ])
        
        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        const email = emailOrError.getValue()
        const forgotKey = forgotKeyOrError.getValue()
        const password = passwordOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)

            if(!user)
                return left(new ResetPasswordUserErrors.EmailNotFoundError(email.value))
            if(JSON.stringify(user.forgotKey) !== JSON.stringify(forgotKey))
                return left(new ResetPasswordUserErrors.ForgotKeyInvalidError())
            if (!user.forgotKey || user.forgotExpire.value < new Date())
                return left(new ResetPasswordUserErrors.ExpiredTimeError())
                
            const userDb = new UserDb()
            userDb.password = await password.getHashedValue()
            userDb.forgotKey = ''

            try {
                const isUpdated = await this._userRepository.update(user.id.toString(), userDb)
                if(!isUpdated)
                    return left(new ResetPasswordUserErrors.CannotSaveError())
                return right(Result.OK(isUpdated))
            }
            catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error))
            }
        }
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
