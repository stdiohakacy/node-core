import { GenderType } from './../../../enums/GenderType';
import { Either, Result } from './../../../../../shared/core/Result';
import { GetProfileUserErrors } from './GetProfileUserErrors';
import { User } from '../../../domain/aggregateRoot/User';

export class GetProfileUserResult {
    id: string | number;
    // createdAt: Date;
    // updatedAt: Date;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    constructor(user: User) {
        this.id = user.id.toValue();
        // this.createdAt = user.createdAt;
        // this.updatedAt = user.updatedAt;
        this.firstName = user.firstName && user.firstName.value || '';
        this.lastName = user.lastName && user.lastName.value || '';
        this.email = user.email && user.email.value || '';
        this.avatar = user.avatar && user.avatar.value || '';
        this.gender = user.gender && user.gender.value || null;
        this.birthday = user.birthday && user.birthday.value.toString() || '';
        this.phone = user.phone && user.phone.value || '';
        this.address = user.address && user.address.value || '';
        this.culture = user.culture && user.culture.value || '';
        this.currency = user.currency && user.currency.value || '';
    }
}

export type GetProfileUserResponse = Either<
    GetProfileUserErrors.NotFoundError |
    Result<any>,
    Result<GetProfileUserResult>
>
