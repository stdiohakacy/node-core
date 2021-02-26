import { UserRepository } from './../../modules/user/repositories/UserRepository';

export class ServiceRepositoryContext {
    static instance: ServiceRepositoryContext
    private _userRepository: UserRepository

    static getInstance(): ServiceRepositoryContext {
        if(!this.instance)
            this.instance = new ServiceRepositoryContext()
        return this.instance
    }

    // user
    get userRepository(): UserRepository {
        return this._userRepository
    }

    public setUserRepository(userRepository: UserRepository): ServiceRepositoryContext {
        this._userRepository = userRepository
        return this;
    }
}
