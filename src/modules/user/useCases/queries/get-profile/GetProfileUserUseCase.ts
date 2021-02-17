import { UserMapper } from './../../../infra/UserMapper';
import { GetProfileUserResponse, GetProfileUserResult } from './GetProfileUserResponse';
import { left, Result, right } from './../../../../../shared/core/Result';
import { Inject, Service } from 'typedi';
import { IUseCaseQueryCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UserRepository } from '../../../../user/repositories/UserRepository';
import { GetProfileUserQueryDTO } from './GetProfileUserQueryDTO';
import { UserId } from '../../../domain/entity/UserId';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { GetProfileUserErrors } from './GetProfileUserErrors';

@Service()
export class GetProfileUserUseCase implements IUseCaseQueryCQRS<GetProfileUserQueryDTO, Promise<GetProfileUserResponse>> {
    @Inject('user.repository')
    private _userRepository: UserRepository;
    
    async execute(param: GetProfileUserQueryDTO): Promise<GetProfileUserResponse> {
        const idOrError = UserId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail(idOrError.error));

        const userId = idOrError.getValue()

        try {
            const user = await this._userRepository.getById(userId.id.toString())
            if(!user)
                return left(new GetProfileUserErrors.NotFoundError(userId.id.toString()))

            const userMapper = UserMapper.toDomain(user)
            return right(Result.OK(new GetProfileUserResult(userMapper)));
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
