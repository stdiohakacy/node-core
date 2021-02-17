import * as crypto from 'crypto';
import { Inject, Service } from 'typedi';
import { right } from '../../../../../shared/core/Result';
import { UserDb } from '../../../infra/databases/typeorm/entities/UserDb';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserEmail } from '../../../domain/valueObject/UserEmail';
import { ForgotPasswordUserResponse } from './ForgotPasswordUserResponse';
import { ForgotPasswordUserCommandDTO } from './ForgotPasswordUserCommandDTO';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result } from '../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserStatusType } from '../../../enums/UserStatusType';
import { ForgotPasswordUserErrors } from './ForgotPasswordUserErrors';
import { addSeconds } from '../../../../../shared/libs/date';
import { MailService } from '../../../../../shared/services/mail/MailService';

@Service()
export class ForgotPasswordUserUseCase implements IUseCaseCommandCQRS<ForgotPasswordUserCommandDTO, Promise<ForgotPasswordUserResponse>> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    @Inject('mail.service')
    private readonly _mailService: MailService;

    async execute(param: ForgotPasswordUserCommandDTO): Promise<ForgotPasswordUserResponse> {
        const emailOrError = UserEmail.create({ value: param.email })

        if(emailOrError.isFailure)
            return left(Result.fail(emailOrError.error));

        const email = emailOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)

            if (!user)
                return left(new ForgotPasswordUserErrors.EmailNotFoundError(email.value))
               
            if(user.status.value !== UserStatusType.ACTIVED)
                return left(new ForgotPasswordUserErrors.DataInvalidError())

            const userDb = new UserDb()
            userDb.forgotKey = crypto.randomBytes(32).toString('hex')
            userDb.forgotExpire = addSeconds(new Date(), 3 * 24 * 60 * 60)

            try {
                const isUpdated = await this._userRepository.update(user.id.toString(), userDb)
                if(!isUpdated)
                    return left(new ForgotPasswordUserErrors.CannotSaveError())
                // 
                this._mailService.sendForgotPassword(user)
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
