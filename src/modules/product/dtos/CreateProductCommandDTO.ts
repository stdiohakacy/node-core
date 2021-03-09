import { ICommand } from "../../../shared/core/ICQRS"

export class CreateProductCommandDTO implements ICommand {
    name: string
    price: number
    categoryId: string
}
