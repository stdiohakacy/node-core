import { IQuery } from "../../../shared/core/ICQRS";

export class GetCategoryByIdQueryDTO implements IQuery {
    id: string | number
}
