import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { RedisAuthService } from "../../../../../shared/services/auth/RedisAuthService";
import { UserRepository } from "../../../infra/repositories/UserRepository";
import { LogoutUserCommandDTO } from "../request/LogoutUserCommandDTO";
import { LogoutUserErrors } from "../errors/LogoutUserErrors";
import { UserId } from "../../blocks/entity/UserId";
import { LogoutUserResponse } from "../response/LogoutUserResponse";

@Service()
export class LogoutUserUseCase implements IUseCaseCommandCQRS<
    LogoutUserCommandDTO,
    Promise<LogoutUserResponse>
> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    @Inject('redis.auth.service')
    private readonly _redisAuthService: RedisAuthService;
    
    async execute(param: LogoutUserCommandDTO): Promise<LogoutUserResponse> {
        const idOrError = UserId.create(new UniqueEntityId(param.userId))
        if(idOrError.isFailure)
            return left(Result.fail(idOrError.error))
        const userId = idOrError.getValue()

        try {
            const user = await this._userRepository.getById(userId.id.toString())
            if(!user)
                return left(new LogoutUserErrors.NotFoundError())
            const isLogout = await this._redisAuthService.deAuthenticateUser(user.email)
            return right(Result.OK(isLogout))
            
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError())
        }
    }
}
