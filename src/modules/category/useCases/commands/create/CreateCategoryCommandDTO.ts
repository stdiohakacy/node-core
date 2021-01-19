import { ICommand } from "../../../../../shared/core/ICQRS";

export class CreateCategoryCommandDTO implements ICommand {
    name: string;
}
