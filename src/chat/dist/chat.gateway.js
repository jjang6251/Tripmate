"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var chat_guard_1 = require("./chat.guard");
var mongoose_1 = require("@nestjs/mongoose");
// import { InjectModel } from '@nestjs/mongoose';
var ChatGateway = /** @class */ (function () {
    function ChatGateway(chatModel) {
        this.chatModel = chatModel;
    }
    ChatGateway.prototype.handleConnection = function (client) {
        console.log("Client connected: " + client.id);
        console.log(client.handshake.auth.token);
    };
    ChatGateway.prototype.handleDisconnect = function (client) {
        console.log("Client disconnected: " + client.id);
    };
    ChatGateway.prototype.handleJoinRoom = function (data, // 메시지 바디에서 room 정보를 받음
    client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Welcome to " + data.room);
                client.join(data.room); // 소켓을 특정 방에 참여시킴
                client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림
                return [2 /*return*/];
            });
        });
    };
    // 클라이언트가 특정 방에서 나가도록 하는 메서드
    ChatGateway.prototype.handleLeaveRoom = function (data, // 메시지 바디에서 room 정보를 받음
    client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                client.leave(data.room); // 소켓을 특정 방에서 나가게 함
                client.emit('leftRoom', data.room); // 방에서 성공적으로 나갔음을 클라이언트에게 알림
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.handleMessage = function (client, createMessageDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, message, newMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = client.user;
                        message = __assign(__assign({}, createMessageDto), { sender: user.userid, createdAt: new Date() });
                        newMessage = new this.chatModel(message);
                        return [4 /*yield*/, newMessage.save()];
                    case 1:
                        _a.sent();
                        console.log('Message from Room:', message);
                        client.to(createMessageDto.room).emit('emitmessage', message);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], ChatGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('joinRoom'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ChatGateway.prototype, "handleJoinRoom");
    __decorate([
        websockets_1.SubscribeMessage('leaveRoom'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ChatGateway.prototype, "handleLeaveRoom");
    __decorate([
        common_1.UseGuards(chat_guard_1.WsJwtGuard),
        websockets_1.SubscribeMessage('message'),
        __param(0, websockets_1.ConnectedSocket()),
        __param(1, websockets_1.MessageBody())
    ], ChatGateway.prototype, "handleMessage");
    ChatGateway = __decorate([
        websockets_1.WebSocketGateway({
            namespace: '/chat',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true // 쿠키를 포함한 요청을 허용
            }
        })
        // 게이트웨이 전체에 가드 적용
        ,
        __param(0, mongoose_1.InjectModel('Chat'))
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
