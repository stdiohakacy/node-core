import { ICommand } from "../../../shared/core/ICQRS"

export class UpdateProductCommandDTO implements ICommand {
    id: string
    name?: string
    price?: number
    categoryId?: string
    tags?: string[]
}
