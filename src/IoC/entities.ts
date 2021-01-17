import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IBaseRepository, ICategoryRepository, IUseCaseIoC } from "./interfaces";
import TYPES from "./types";

@injectable()
abstract class BaseRepository implements IBaseRepository {
    create(): string {
        return "created"
    }
    get(): string {
        return "geted"
    }
    update(): string {
        return "updated"
    }
    delete(): string {
        return "deleted"
    }
}

@injectable()
class CategoryRepository extends BaseRepository implements ICategoryRepository {
    isExist(): string {
        return "is exist"
    }
}

@injectable()
class GetByIdUseCase implements IUseCaseIoC {
    private _categoryRepository: ICategoryRepository;

    public constructor(
        @inject(TYPES.ICategoryRepository) _categoryRepository: ICategoryRepository,
    ) {
        this._categoryRepository = _categoryRepository;
    }
    public execute(): string {
        return this._categoryRepository.create()
    }
}

export { GetByIdUseCase, CategoryRepository };
