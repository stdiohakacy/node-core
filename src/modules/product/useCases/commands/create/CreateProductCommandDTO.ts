import { ICommand } from "../../../../../shared/core/ICQRS"
import { CategoryId } from "../../../../category/domain/entity/CategoryId"

export class CreateProductCommandDTO implements ICommand {
    name: string
    price: number
    categoryId: string
}
