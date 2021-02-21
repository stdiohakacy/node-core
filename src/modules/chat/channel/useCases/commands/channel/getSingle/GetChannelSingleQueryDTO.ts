import { IQuery } from "../../../../../../../shared/core/ICQRS"
import { UserAuthenticated } from "../../../../../../auth/useCases/command/authenticate/AuthenticateResponse"

export class GetChannelSingleQueryDTO implements IQuery {
    userAuthenticated: UserAuthenticated
    toUserId: string
}
