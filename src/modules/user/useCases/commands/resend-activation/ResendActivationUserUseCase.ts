import { ResendActivationUserResponse } from './ResendActivationUserResponse';
import { ResendActivationUserCommandDTO } from './ResendActivationUserCommandDTO';
import { right } from './../../../../../shared/core/Result';
import { UserDb } from './../../../infra/databases/typeorm/entities/UserDb';
import { UserRepository } from './../../../repositories/UserRepository';
import { UserEmail } from './../../../domain/valueObject/UserEmail';
import { UserActiveKey } from './../../../domain/valueObject/UserActiveKey';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result } from '../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { UserStatusType } from '../../../enums/UserStatusType';
import { ResendActivationUserErrors } from './ResendActivationUserErrors';
import { addSeconds } from '../../../../../shared/libs/date';
import { UserActiveExpire } from '../../../domain/valueObject/UserActiveExpire';
import { randomBytes } from 'crypto';

@Service()
export class ResendActivationUserUseCase implements IUseCaseCommandCQRS<ResendActivationUserCommandDTO, Promise<ResendActivationUserResponse>> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    async execute(param: ResendActivationUserCommandDTO): Promise<ResendActivationUserResponse> {
        const emailOrError = UserEmail.create({ value: param.email })

        if(emailOrError.isFailure)
            return left(Result.fail(emailOrError.error));

        const email = emailOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)
            if (!user)
                return left(new ResendActivationUserErrors.NotFoundError)
            if(user.status.value === UserStatusType.ACTIVED)
                return left(new ResendActivationUserErrors.UserStatusError)

            const activeKeyOrError = UserActiveKey.create({value: randomBytes(32).toString('hex')})
            const activeExpireOrError = UserActiveExpire.create({ value: addSeconds(new Date(), 3 * 24 * 60 * 60 ) })

            const dtoResults = Result.combine([
                activeKeyOrError,
                activeExpireOrError
            ])

            if(dtoResults.isFailure) {
                return left(Result.fail(dtoResults.error))
            }

            const activeKey = activeKeyOrError.getValue()
            const activeExpire = activeExpireOrError.getValue()

            try {
                const userDb = new UserDb()
                userDb.activeKey = activeKey.value
                userDb.activeExpire = activeExpire.value

                const isUpdated = await this._userRepository.update(user.id.toString(), userDb)
                if(!isUpdated)
                    return left(new ResendActivationUserErrors.CannotSaveError())
                    
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
