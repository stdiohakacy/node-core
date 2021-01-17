import { IBaseRepository, ICategoryRepository, IUseCaseIoC } from './interfaces';
import { Container } from "inversify";
import { CategoryRepository, GetByIdUseCase } from "./entities";
import TYPES from "./types";

const container = new Container();

container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
container.bind<IUseCaseIoC>(TYPES.IUseCaseIoC).to(GetByIdUseCase);

// const useCase = container.get<IUseCase<IGetCategoryByIdDTO, Promise<GetCategoryByIdResponse>>>(TYPES.IUseCase)
export default container;
