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

        if(!validator.isEmpty(props.value))
            return Result.fail<UserAvatar>(`Avatar is null or undefined`)

        if(!validator.minLength(props.value, this.minLength)) {
            return Result.fail<UserAvatar>(`Avatar min length require ${this.minLength}`)
        }

        if(!validator.maxLength(props.value, this.maxLength)) {
            return Result.fail<UserAvatar>(`Avatar max length require ${this.maxLength}`)
        }

        return Result.OK<UserAvatar>(new UserAvatar({value: props.value}))
    }
}
