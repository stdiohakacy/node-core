import { ICommand } from "../../../shared/core/ICQRS";

export class DeleteCategoryCommandDTO implements ICommand {
    id: string
}
