import { PrivateMessageRepository } from './../../modules/chat/private/repositories/PrivateMessageRepository';
import { RedisAuthService } from './../services/auth/RedisAuthService';
import { UserRepository } from "../../modules/user/repositories/UserRepository";

export class ServiceRepositoriesContext {
    static instance: ServiceRepositoriesContext;

    static getInstance(): ServiceRepositoriesContext {
        if (!ServiceRepositoriesContext.instance) {
            ServiceRepositoriesContext.instance = new ServiceRepositoriesContext();
        }
        return ServiceRepositoriesContext.instance;
    }

    // user repository
    private _userRepository: UserRepository;
    public get userRepository() {
        return this._userRepository;
    }

    public setUserRepository(userRepository: UserRepository): ServiceRepositoriesContext {
        this._userRepository = userRepository;
        return this;
    }

    // auth service
    private _redisAuthSerice: RedisAuthService
    public get redisAuthService() {
        return this._redisAuthSerice;
    }

    public setRedisAuthService(redisAuthService: RedisAuthService): ServiceRepositoriesContext {
        this._redisAuthSerice = redisAuthService;
        return this;
    }

    // private message repository
    private _privateMessageRepository: PrivateMessageRepository;
    public get privateMessageRepository() {
        return this._privateMessageRepository;
    }

    public setPrivateMessageRepository(privateMessageRepository: PrivateMessageRepository): ServiceRepositoriesContext {
        this._privateMessageRepository = privateMessageRepository;
        return this;
    }
}
