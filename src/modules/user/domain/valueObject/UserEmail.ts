import { MessageError, ContentError } from './../../../../shared/exceptions/MessageError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserEmailProps {
    value: string
}

export class UserEmail extends ValueObject<IUserEmailProps> {
    public static maxLength: number = 120;
    public static minLength: number = 10;

    private constructor (props: IUserEmailProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserEmailProps): Result<UserEmail> {
        if(!validator.isEmail(props.value)) {
            return Result.fail<UserEmail>(new MessageError(ContentError.DATA_INVALID()).getMessage())
        }
        if(!validator.minLength(props.value, this.minLength))
            return Result.fail<UserEmail>(
                new MessageError(
                    ContentError.PARAM_LEN_GREATER_OR_EQUAL(), 
                    'email', 
                    this.minLength)
                .getMessage()
            )
        if(!validator.maxLength(props.value, this.maxLength))
            return Result.fail<UserEmail>(
                new MessageError(
                    ContentError.PARAM_LEN_LESS_OR_EQUAL(), 
                    'email', 
                    this.maxLength)
                .getMessage()
            )

        return Result.OK<UserEmail>(new UserEmail({value: this.format(props.value)}))
    }

    // private static isValidEmail(email: string): boolean {
    //     const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //     return regex.test(email)
    // }

    private static format(email: string): string {
        return email.trim().toLowerCase()
    }
}
