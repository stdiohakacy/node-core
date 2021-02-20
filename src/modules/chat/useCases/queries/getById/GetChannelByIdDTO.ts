import { IQuery } from "../../../../../shared/core/ICQRS";
import { UserAuthenticated } from "../../../../auth/useCases/command/authenticate/AuthenticateResponse";

export class GetChannelByIdDTO implements IQuery {
    id: string
    userAuthenticated?: UserAuthenticated
}
