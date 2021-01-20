import { mapTemplate } from "../libs/common";

export class MessageError {
    private _message: string

    constructor(message: string, ...params) {
        this._message = params && params.length ? mapTemplate(message, ...params) : message;
    }

    public getMessage(): string {
        return this._message
    }
}

export class ContentError {
    static SOMETHING_WRONG(): string {
        return 'Something went wrong!'
    }

    static NOT_SUPPORTED(): string {
        return 'The {0} is not supported!'
    }

    static ACCESS_DENIED(): string {
        return 'Access is denied!'
    }

    static DATA_NOT_FOUND(): string {
        return 'Data not found!'
    }

    static PARAM_NOT_FOUND(): string {
        return 'The {0} was not found!'
    }

    static DATA_CANNOT_SAVE(): string {
        return 'Data cannot save!'
    }

    static PARAM_CANNOT_UPLOAD(): string {
        return 'The {0} cannot upload!'
    }

    static PARAM_REQUIRED(): string {
        return 'The {0} is required!'
    }

    static PARAM_INCORRECT(): string {
        return 'The {0} is incorrect!'
    }

    static PARAM_EXISTED(): string {
        return 'The {0} is already existed!'
    }

    static PARAM_SENT(): string {
        return 'The {0} has been sent!'
    }

    static PARAM_NOT_EXISTS(): string {
        return 'The {0} is not exists!'
    }

    static PARAM_EXPIRED(): string {
        return 'The {0} has expired!'
    }
    
    static PARAM_NOT_ACTIVATED(): string {
        return 'The {0} has not been activated!'
    }

    static PARAM_NOT_VERIFIED(): string {
        return 'The {0} has not been verified!'
    }

    static PARAM_SOFT_DELETED(): string {
        return 'The {0} has not been soft deleted!'
    }

    static DATA_INVALID(): string {
        return 'Data is invalid!'
    }

    static PARAM_INVALID(): string {
        return 'The {0} is invalid!'
    }

    static PARAM_FORMAT_INVALID(): string {
        return 'The format of {0} is invalid or not supported! The following formats are supported: {1}'
    }

    static PARAM_MAX_NUMBER(): string {
        return 'The maximum number of {0} is {1}!'
    }

    static PARAM_SIZE_MAX(): string {
        return 'The size of {0} must be a maximum of {1} ({2})!'
    }
    
    static PARAM_LEN_EQUAL(): string {
        return 'The length of {0} must be {1}!'
    }

    static PARAM_LEN_AT_LEAST(): string {
        return 'The length of {0} must be at least {1}!'
    }

    static PARAM_LEN_AT_LEAST_AND_MAX(): string {
        return 'The length of {0} must be at least {1} and maximum {2}!'
    }

    static PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL(): string {
        return 'The length of {0} must be at least {1} and maximum {2} with one uppercase letter, one lower case letter, one digit and one special character!'
    }

    static PARAM_LEN_MAX(): string {
        return 'The length of {0} must be a maximum of {1}!'
    }

    static PARAM_LEN_LESS_OR_EQUAL(): string {
        return 'The length of {0} must be less than or equal to {1}!'
    }

    static PARAM_LEN_GREATER_OR_EQUAL(): string {
        return 'The length of {0} must be greater than or equal to {1}!'
    }
    
    static PARAM_LEN_BETWEEN(): string {
        return 'The length of {0} must be between {1} and {2}!'
    }
}
