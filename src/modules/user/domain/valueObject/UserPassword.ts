import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import * as bcrypt from 'bcrypt-nodejs'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserPasswordProps {
    value: string
    hashed?: boolean
}
export class UserPassword extends ValueObject<IUserPasswordProps> {
    public static minLength: number = 6;
    public static maxLength: number = 32;

    private constructor (props: IUserPasswordProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IUserPasswordProps): Result<UserPassword> {
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password')
        if(!props.hashed) {
            if(
                !validator.minLength(props.value, this.minLength) || 
                !validator.maxLength(props.value, this.maxLength)
            )
            throw new SystemError(MessageError.PARAM_LEN_BETWEEN, 'password', 6, 12)
        }
        if(!this.isStrong(props.value))
            throw new SystemError(MessageError.PASSWORD_IS_NOT_STRONG)

        return Result.OK(
            new UserPassword({
                value: props.value, 
                hashed: !!props.hashed === true
            }))
    }

    public getHashedValue(): Promise<string> {
        return new Promise(resolve => {
            if(this.isAlreadyHashed())
                return resolve(this.props.value)
            return resolve(this.hashPassword(this.props.value))
        })
    }

    public async comparePassword(plainTextPassword: string): Promise<boolean> {
        let hashed: string
        if(this.isAlreadyHashed()) {
            hashed = this.props.value
            return this.bcryptCompare(plainTextPassword, hashed)
        }
        return this.props.value === plainTextPassword
    }

    public isAlreadyHashed(): boolean {
        return this.props.hashed
    }

    private hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, null, null, (error, hash) => {
                if(error)
                    return reject(error)
                resolve(hash)
            })
        })
    }

    private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainText, hashed, (error, compareResult) => {
                if(error)
                    return resolve(false)
                return resolve(compareResult)
            })
        })
    }

    public static isStrong(password: string): boolean {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return strongRegex.test(password)
    }
}
