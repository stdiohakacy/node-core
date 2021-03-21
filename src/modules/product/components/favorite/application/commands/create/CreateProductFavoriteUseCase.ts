import { ProductFavoriteMapper } from '../../../infra/databases/ProductFavoriteMapper';
import { ProductFavoriteRepository } from '../../../infra/repositories/ProductFavoriteRepository';
import { Inject, Service } from "typedi";
import { IUseCaseCommandCQRS } from "../../../../../../../shared/core/IUseCase";
import { CreateProductFavoriteCommandDTO } from '../../../dtos/CreateProductFavoriteCommandDTO';
import { CreateProductFavoriteResponse } from './CreateProductFavoriteResponse';
import { ProductFavorite } from '../../../domain/valueObjects/ProductFavorite';
import { UserId } from '../../../../../../user/domain/blocks/entity/UserId';
import { UniqueEntityId } from '../../../../../../../shared/domain/UniqueEntityId';
import { ProductId } from '../../../../../domain/entities/ProductId';
import { left, Result, right } from '../../../../../../../shared/core/Result';
import { CreateProductFavoriteErrors } from './CreateProductFavoriteErrors';
import { ApplicationError } from '../../../../../../../shared/core/ApplicationError';

@Service()
export class CreateProductFavoriteUseCase implements IUseCaseCommandCQRS<CreateProductFavoriteCommandDTO, Promise<CreateProductFavoriteResponse>> {
    @Inject('product_favorite.repository')
    private readonly _productFavoriteRepository: ProductFavoriteRepository;

    async execute(param: CreateProductFavoriteCommandDTO): Promise<CreateProductFavoriteResponse> {
        const productFavoriteOrError = ProductFavorite.create({
            userId: UserId.create(new UniqueEntityId(param.userId)).getValue(),
            productId: ProductId.create(new UniqueEntityId(param.productId)).getValue(),
            status: true
        })
        if (productFavoriteOrError.isFailure)
            return left(Result.fail(productFavoriteOrError.error));

        const productFavorite = productFavoriteOrError.getValue();
        try {
            const isExist = await this._productFavoriteRepository.isExist(param.userId, param.productId)
            if(isExist)
                return left(new CreateProductFavoriteErrors.AlreadyExist())

            const productFavoriteDb = ProductFavoriteMapper.toPersistence(productFavorite)
            try {
                const id = await this._productFavoriteRepository.create(productFavoriteDb)
                if(!id)
                    return left(new CreateProductFavoriteErrors.DataCannotSave())
                return right(Result.OK(id))
            } catch (error) {
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
