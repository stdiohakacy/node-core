export interface IBaseRepository {
    create(): string;
    get(): string;
    update(): string;
    delete(): string
}

export interface ICategoryRepository extends IBaseRepository {
    isExist(): string
}

export interface IUseCaseIoC {
    execute(): string;
}
