import { Inject, Service } from 'typedi';
import { right } from '../../../../../shared/core/Result';
import { UserDb } from '../../../infra/databases/typeorm/entities/UserDb';
import { UserRepository } from '../../../infra/repositories/UserRepository';
import { ActiveUserResponse } from '../response/ActiveUserResponse';
import { ActiveUserCommandDTO } from '../request/ActiveUserCommandDTO';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result } from '../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserStatusType } from '../../blocks/enums/UserStatusType';
import { UserActiveKey } from '../../blocks/valueObject/UserActiveKey';
import { UserEmail } from '../../blocks/valueObject/UserEmail';
import { ActiveUserErrors } from '../errors/ActiveUserErrors';

@Service()
export class ActiveUserUseCase implements IUseCaseCommandCQRS<ActiveUserCommandDTO, Promise<ActiveUserResponse>> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    async execute(param: ActiveUserCommandDTO): Promise<ActiveUserResponse> {
        const activeKeyOrError = UserActiveKey.create({ value: param.activeKey })
        const emailOrError = UserEmail.create({ value: param.email })

        const dtoResults = Result.combine([
            activeKeyOrError,
            emailOrError,
        ])

        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        const email = emailOrError.getValue()
        const activeKey = activeKeyOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)

            if (!user)
                return left(new ActiveUserErrors.EmailNotFoundError(email.value))
            if(user.status.value === UserStatusType.ACTIVED && !user.activeKey)
                return left(new ActiveUserErrors.UserStatusError )
            if( JSON.stringify(user.activeKey) !== JSON.stringify(activeKey))
                return left(new ActiveUserErrors.ActiveKeyInvalidError)
            if (!user.activeExpire || user.activeExpire.value < new Date())
                return left(new ActiveUserErrors.ExpiredTimeError)
                
            const userDb = new UserDb()
            userDb.status = UserStatusType.ACTIVED
            userDb.activeKey = ''
            userDb.activedAt = new Date()

            try {
                const isUpdated = await this._userRepository.update(user.id.toString(), userDb)
                if(!isUpdated)
                    return left(new ActiveUserErrors.CannotSaveError())
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
