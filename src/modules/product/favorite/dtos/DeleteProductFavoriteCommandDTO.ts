import { ICommand } from "../../../../shared/core/ICQRS"

export class DeleteProductFavoriteCommandDTO implements ICommand {
    id: string
}
