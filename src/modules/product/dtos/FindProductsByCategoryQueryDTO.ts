import { Filter } from "../../../shared/core/Filter";

export class FindProductsByCategoryQueryDTO extends Filter {
    keyword?: string
    categoryId: string
}
