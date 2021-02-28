// import { GroupMessageRepository } from './../../modules/chat/group/repositories/GroupMessageRepository';
// import { GroupUserRepository } from './../../modules/chat/group/repositories/GroupUserRepository';
// import { GroupRepository } from './../../modules/chat/group/repositories/GroupRepository';
// import { PrivateMessageRepository } from './../../modules/chat/private/repositories/PrivateMessageRepository';
// import { RedisAuthService } from './../services/auth/RedisAuthService';
// import { UserRepository } from "../../modules/user/repositories/UserRepository";

// export class ServiceRepositoriesContext {
//     static instance: ServiceRepositoriesContext;

//     static getInstance(): ServiceRepositoriesContext {
//         if (!ServiceRepositoriesContext.instance) {
//             ServiceRepositoriesContext.instance = new ServiceRepositoriesContext();
//         }
//         return ServiceRepositoriesContext.instance;
//     }

//     // user repository
//     private _userRepository: UserRepository;
//     public get userRepository() {
//         return this._userRepository;
//     }

//     public setUserRepository(userRepository: UserRepository): ServiceRepositoriesContext {
//         this._userRepository = userRepository;
//         return this;
//     }

//     // auth service
//     private _redisAuthSerice: RedisAuthService
//     public get redisAuthService() {
//         return this._redisAuthSerice;
//     }

//     public setRedisAuthService(redisAuthService: RedisAuthService): ServiceRepositoriesContext {
//         this._redisAuthSerice = redisAuthService;
//         return this;
//     }

//     // private message repository
//     private _privateMessageRepository: PrivateMessageRepository;
//     public get privateMessageRepository() {
//         return this._privateMessageRepository;
//     }

//     public setPrivateMessageRepository(privateMessageRepository: PrivateMessageRepository): ServiceRepositoriesContext {
//         this._privateMessageRepository = privateMessageRepository;
//         return this;
//     }

//     // group repository
//     private _groupRepository: GroupRepository;
//     public get groupRepository() {
//         return this._groupRepository;
//     }

//     public setGroupRepository(groupRepository: GroupRepository): ServiceRepositoriesContext {
//         this._groupRepository = groupRepository;
//         return this;
//     }

//     // group_user repository
//     private _groupUserRepository: GroupUserRepository;
//     public get groupUserRepository() {
//         return this._groupUserRepository;
//     }

//     public setGroupUserRepository(groupUserRepository: GroupUserRepository): ServiceRepositoriesContext {
//         this._groupUserRepository = groupUserRepository;
//         return this;
//     }

//     // group_message repository
//     private _groupMessageRepository: GroupMessageRepository;
//     public get groupMessageRepository() {
//         return this._groupMessageRepository;
//     }

//     public setGroupMessageRepository(groupMessageRepository: GroupMessageRepository): ServiceRepositoriesContext {
//         this._groupMessageRepository = groupMessageRepository;
//         return this;
//     }
// }
