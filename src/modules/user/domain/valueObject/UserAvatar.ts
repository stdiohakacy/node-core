import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserAvatarProps {
    value: string
}

export class UserAvatar extends ValueObject<IUserAvatarProps> {
    public static minLength: number = 10;
    public static maxLength: number = 200;

    private constructor (props: IUserAvatarProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IUserAvatarProps): Result<UserAvatar> {
        props.value = props.value.trim()

        // if(validator.isEmpty(props.value))
        //     return Result.fail<UserAvatar>(
        //         new MessageError(
        //             ContentError.PARAM_REQUIRED(), 
        //             'avatar'
        //         ).getMessage())
        // if(!validator.minLength(props.value, this.minLength))
        //     return Result.fail<UserAvatar>(
        //         new MessageError(
        //             ContentError.PARAM_LEN_GREATER_OR_EQUAL(), 
        //             'avatar', 
        //             this.minLength).getMessage()
        //         )
        // if(!validator.maxLength(props.value, this.maxLength)) {
        //     return Result.fail<UserAvatar>(
        //         new MessageError(
        //             ContentError.PARAM_LEN_LESS_OR_EQUAL(), 
        //             'avatar', 
        //             this.maxLength
        //         ).getMessage())
        // }

        return Result.OK<UserAvatar>(new UserAvatar({value: props.value}))
    }
}
