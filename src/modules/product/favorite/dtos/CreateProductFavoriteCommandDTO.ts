import { ICommand } from "../../../../shared/core/ICQRS"

export class CreateProductFavoriteCommandDTO implements ICommand {
    userId: string
    productId: string
}
