import * as validator from 'class-validator'
import { MessageError, ContentError } from './../exceptions/MessageError';

export interface IGuardResult {
    succeeded: boolean;
    message?: string;
}

export interface IGuardArgument {
    argument: any;
    argumentName: string;
  }

export type GuardArgumentCollection = IGuardArgument[];
  
export class Guard {
    public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
        if(validator.isEmpty(argument))
            return {
                succeeded: false,
                message: new MessageError(ContentError.PARAM_INVALID(), argumentName).getMessage()
            }
    }

    public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
        for (let arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (!result.succeeded) 
                return result;
        }
    
        return { 
            succeeded: true 
        }
    }
}