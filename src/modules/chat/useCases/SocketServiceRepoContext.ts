import { RedisAuthService } from "../../../shared/services/auth/RedisAuthService";
import { UserRepository } from "../../user/infra/repositories/UserRepository";
import { ChannelRepository } from "../repositories/ChannelRepository";
import { ChannelUserRepository } from "../repositories/ChannelUserRepository";
import { MessageRepository } from "../repositories/MessageRepository";

export class SocketServiceRepoContext {
    static instance: SocketServiceRepoContext;

    static getInstance(): SocketServiceRepoContext {
        if (!SocketServiceRepoContext.instance) {
            SocketServiceRepoContext.instance = new SocketServiceRepoContext();
        }
        return SocketServiceRepoContext.instance;
    }

    // channel repository
    private _channelRepository: ChannelRepository;
    public get channelRepository() {
        return this._channelRepository;
    }

    public setChannelRepository(channelRepository: ChannelRepository): SocketServiceRepoContext {
        this._channelRepository = channelRepository;
        return this;
    }

    // channel_user repository
    private _channelUserRepository: ChannelUserRepository;
    public get channelUserRepository() {
        return this._channelUserRepository;
    }

    public setChannelUserRepository(channelRepository: ChannelUserRepository): SocketServiceRepoContext {
        this._channelUserRepository = channelRepository;
        return this;
    }

    // message repository
    private _messageRepository: MessageRepository;
    public get messageRepository() {
        return this._messageRepository;
    }

    public setMessageRepository(messageRepository: MessageRepository): SocketServiceRepoContext {
        this._messageRepository = messageRepository;
        return this;
    }

    // user repository
    private _userRepository: UserRepository;
    public get userRepository() {
        return this._userRepository;
    }

    public setUserRepository(userRepository: UserRepository): SocketServiceRepoContext {
        this._userRepository = userRepository;
        return this;
    }

    // redis auth service
    private _redisAuthService: RedisAuthService;
    public get redisAuthService() {
        return this._redisAuthService;
    }

    public setRedisAuthService(redisAuthService: RedisAuthService): SocketServiceRepoContext {
        this._redisAuthService = redisAuthService;
        return this;
    }
}
