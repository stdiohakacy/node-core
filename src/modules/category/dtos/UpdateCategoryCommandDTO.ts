import { ICommand } from "../../../shared/core/ICQRS"

export class UpdateCategoryCommandDTO implements ICommand {
    id: string
    name: string
}