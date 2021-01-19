import { GenderType } from './../../enums/GenderType';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserGenderProps {
    value: GenderType
}

export class UserGender extends ValueObject<IUserGenderProps> {
    private constructor (props: IUserGenderProps) {
        super(props);
    }

    get value(): GenderType {
        return this.props.value
    }

    public static create(props: IUserGenderProps): Result<UserGender> {
        if(!validator.isEnum(props.value, GenderType))
            return Result.fail<UserGender>(`Gender invalid`)
        return Result.OK<UserGender>(new UserGender({value: props.value}))
    }
}
