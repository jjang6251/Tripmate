"use strict";
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
exports.PreparationsGateway = void 0;
// src/preparations/preparations.gateway.ts
var websockets_1 = require("@nestjs/websockets");
var PreparationsGateway = /** @class */ (function () {
    function PreparationsGateway(preparationsService, tripsService) {
        this.preparationsService = preparationsService;
        this.tripsService = tripsService;
    }
    // 방 입장 처리
    PreparationsGateway.prototype.handleJoinRoom = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var room, preparations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room = data.room;
                        client.join(room);
                        console.log("Client joined room " + room);
                        return [4 /*yield*/, this.preparationsService.getPreparationsByRoom(room)];
                    case 1:
                        preparations = _a.sent();
                        this.server.to(room).emit('preparationList', preparations);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 준비물 추가 처리
    PreparationsGateway.prototype.handleCreateItem = function (createPreparationDto, client) {
        return __awaiter(this, void 0, void 0, function () {
            var room, item, newPreparation, updatedPreparations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room = createPreparationDto.room, item = createPreparationDto.item;
                        return [4 /*yield*/, this.preparationsService.createPreparation(item, room)];
                    case 1:
                        newPreparation = _a.sent();
                        return [4 /*yield*/, this.preparationsService.getPreparationsByRoom(room)];
                    case 2:
                        updatedPreparations = _a.sent();
                        this.server.to(room).emit('preparationList', updatedPreparations);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 준비물 상태 변경 (준비 완료/미완료) 처리
    PreparationsGateway.prototype.handleTogglePreparationStatus = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var id, room, updatedPreparations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.id, room = data.room;
                        // 준비물 상태 변경
                        return [4 /*yield*/, this.preparationsService.togglePreparationStatus(id)];
                    case 1:
                        // 준비물 상태 변경
                        _a.sent();
                        return [4 /*yield*/, this.preparationsService.getPreparationsByRoom(room)];
                    case 2:
                        updatedPreparations = _a.sent();
                        this.server.to(room).emit('preparationList', updatedPreparations);
                        return [2 /*return*/];
                }
            });
        });
    };
    //준비물 삭제 처리
    PreparationsGateway.prototype.handleDeletePreparation = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var id, room, updatedPreparations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.id, room = data.room;
                        // 준비물 삭제
                        return [4 /*yield*/, this.preparationsService.deletePreparation(id)];
                    case 1:
                        // 준비물 삭제
                        _a.sent();
                        return [4 /*yield*/, this.preparationsService.getPreparationsByRoom(room)];
                    case 2:
                        updatedPreparations = _a.sent();
                        this.server.to(room).emit('preparationList', updatedPreparations);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], PreparationsGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('joinRoom'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], PreparationsGateway.prototype, "handleJoinRoom");
    __decorate([
        websockets_1.SubscribeMessage('createItem'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], PreparationsGateway.prototype, "handleCreateItem");
    __decorate([
        websockets_1.SubscribeMessage('togglePreparationStatus'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], PreparationsGateway.prototype, "handleTogglePreparationStatus");
    __decorate([
        websockets_1.SubscribeMessage('deletePreparation'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], PreparationsGateway.prototype, "handleDeletePreparation");
    PreparationsGateway = __decorate([
        websockets_1.WebSocketGateway({
            namespace: '/preparations',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true
            }
        })
    ], PreparationsGateway);
    return PreparationsGateway;
}());
exports.PreparationsGateway = PreparationsGateway;
