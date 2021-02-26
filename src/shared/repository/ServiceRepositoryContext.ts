import { UserRepository } from "../../modules/user/repositories/UserRepository";

export class ServiceRepositoriesContext {
    static instance: ServiceRepositoriesContext;

    static getInstance(): ServiceRepositoriesContext {
        if (!ServiceRepositoriesContext.instance) {
            ServiceRepositoriesContext.instance = new ServiceRepositoriesContext();
        }
        return ServiceRepositoriesContext.instance;
    }

    // user
    private _userRepository: UserRepository;
    public get userRepository() {
        return this._userRepository;
    }

    public setUserRepository(userRepository: UserRepository): ServiceRepositoriesContext {
        this._userRepository = userRepository;
        return this;
    }
}
