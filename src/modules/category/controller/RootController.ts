import { SignUpUserResponse } from './../../user/useCases/commands/signup/SignUpUserResponse';
import { SignUpUserUseCase } from './../../user/useCases/commands/signup/SignUpUserUseCase';
import { SignUpUserCommandDTO } from './../../user/useCases/commands/signup/SignUpUserCommandDTO';
import { Body, JsonController, Post } from "routing-controllers";
import Container from 'typedi';

@JsonController('/v1')
export class RootController {
    constructor(
        private readonly _signUpUserUseCase: SignUpUserUseCase = Container.get(SignUpUserUseCase),
    ) {}

    @Post('/register')
    async register(@Body() param: SignUpUserCommandDTO): Promise<SignUpUserResponse> {
        return await this._signUpUserUseCase.execute(param);
    }
}
