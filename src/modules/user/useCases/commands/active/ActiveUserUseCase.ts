import { UserDb } from './../../../infra/databases/typeorm/entities/UserDb';
import { UserRepository } from './../../../repositories/UserRepository';
import { UserEmail } from './../../../domain/valueObject/UserEmail';
import { UserActiveKey } from './../../../domain/valueObject/UserActiveKey';
import { ActiveUserResponse } from './ActiveUserResponse';
import { ActiveUserCommandDTO } from './ActiveUserCommandDTO';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result } from '../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { UserStatusType } from '../../../enums/UserStatusType';
import { ActiveUserErrors } from './ActiveUserErrors';

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
            return left(Result.fail<void>(dtoResults.error())) as ActiveUserResponse

        const activeKey: UserActiveKey = activeKeyOrError.getValue()
        const email: UserEmail = emailOrError.getValue()

        try {
            const user = await this._userRepository.getByEmail(email)
            if(!user || user.activeKey !== activeKey || user.status.value === UserStatusType.ACTIVED) {
                return left(new ActiveUserErrors.DataInvalidError()) as ActiveUserResponse
            }
            if(!user.activeExpire.value || user.activeExpire.value < new Date())
                return left(new ActiveUserErrors.ExpiredTimeError()) as ActiveUserResponse

            const userDb = new UserDb()
            userDb.status = UserStatusType.ACTIVED
            userDb.activeKey = ''
            userDb.activedAt = new Date()

            try {
                const isUpdated = await this._userRepository.update(user.id.toString(), userDb)
                if(!isUpdated)
                    return left(new ActiveUserErrors.CannotSaveError()) as ActiveUserResponse
            }
            catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error)) as ActiveUserResponse
            }
        }
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error)) as ActiveUserResponse
        }

    }
}
