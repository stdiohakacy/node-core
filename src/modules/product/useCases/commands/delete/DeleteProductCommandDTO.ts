import { ICommand } from "../../../../../shared/core/ICQRS"

export class DeleteProductCommandDTO implements ICommand {
    id: string
}
