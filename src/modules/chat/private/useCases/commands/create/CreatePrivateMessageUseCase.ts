import { UserId } from './../../../../../user/domain/entity/UserId';
import { PrivateMessageRepository } from './../../../repositories/PrivateMessageRepository';
import { CreatePrivateMessageResponse } from './CreatePrivateMessageResponse';
import { CreatePrivateMessageCommandDTO } from './CreatePrivateMessageCommandDTO';
import { Inject, Service } from "typedi"
import { IUseCaseCommandCQRS } from "../../../../../../shared/core/IUseCase"
import { UserRepository } from '../../../../../user/repositories/UserRepository';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { PrivateMessageMsg } from '../../../domain/valueObjects/PrivateMessageMsg';
import { left, Result, right } from '../../../../../../shared/core/Result';
import { PrivateMessage } from '../../../domain/aggregateRoot/PrivateMessage';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { CreatePrivateMessageErrors } from './CreatePrivateMessageErrors';
import { PrivateMessageMapper } from '../../../../infra/PrivateMessageMapper';

@Service()
export class CreatePrivateMessageUseCase implements IUseCaseCommandCQRS<
CreatePrivateMessageCommandDTO,
Promise<CreatePrivateMessageResponse>
> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository
    @Inject('private_message.repository')
    private readonly _privateMessageRepository: PrivateMessageRepository

    async execute(param: CreatePrivateMessageCommandDTO): Promise<CreatePrivateMessageResponse> {
        const toUserIdOrError = UserId.create(new UniqueEntityId(param.toUserId))
        const fromUserIdOrError = UserId.create(new UniqueEntityId(param.fromUserId))
        const msgOrError = PrivateMessageMsg.create({ value: param.message })

        const dtoResults = Result.combine([
            toUserIdOrError,
            fromUserIdOrError,
            msgOrError
        ])

        if (dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        const toUserId = toUserIdOrError.getValue()
        const fromUserId = fromUserIdOrError.getValue()
        const msg = msgOrError.getValue()

        const privateMessageOrError = PrivateMessage.create({
            toUserId,
            fromUserId,
            message: msg
        })

        if (privateMessageOrError.isFailure)
            return left(Result.fail(privateMessageOrError.errorValue()))

        const privateMessage = privateMessageOrError.getValue()
        try {
            const isToUserExist = await this._userRepository.isExist(toUserId.id.toString())
            if (!isToUserExist)
                return left(new CreatePrivateMessageErrors.UserNotFoundError(toUserId.id.toString()))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError())
        }
        try {
            const isFromUserExist = await this._userRepository.isExist(fromUserId.id.toString())
            if (!isFromUserExist)
                return left(new CreatePrivateMessageErrors.UserNotFoundError(fromUserId.id.toString()))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError())
        }
        try {
            const privateMessageMapper = PrivateMessageMapper.toPersistence(privateMessage)
            const isCreated = await this._privateMessageRepository.create(privateMessageMapper)
            if (!isCreated)
                return left(new CreatePrivateMessageErrors.DataCannotSave())
            return right(Result.OK(isCreated))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError())
        }
    }
}
