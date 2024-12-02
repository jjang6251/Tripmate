"use strict";
// import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AuthenticatedSocket } from 'src/chat/interface/custom-socket.interface';
// import { TripsService } from 'src/trips/trip.service';
// import { DetailTripService } from './detail-trip.service';
// import { CreateDetailTripDto } from './dto/createDetailTrip.dto';
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
exports.DetailTripGateway = void 0;
// @WebSocketGateway(
//   {
//     namespace: '/detailTrip',
//     cors: {
//       origin: '*', // 모든 도메인에서의 요청을 허용
//       methods: ['GET', 'POST'], // 허용할 HTTP 메서드
//       allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
//       credentials: true // 쿠키를 포함한 요청을 허용
//     }
//   }
// )
// export class DetailTripGateway {
//   constructor(
//     private tripsService: TripsService, // TripsService 주입
//     private detailTripService: DetailTripService
//   ) { }
//   @WebSocketServer() server: Server;
//   handleConnection(client: AuthenticatedSocket) {
//     console.log(`Client connected: ${client.id}`);
//   }
//   handleDisconnect(client: AuthenticatedSocket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }
//   @SubscribeMessage('joinRoom')
//   async handleJoinRoom(
//     @MessageBody() data: { room: number },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     console.log(`Welcome to ${data.room}`);
//     const tripId = data.room
//     // tripId가 유효한지 확인
//     const tripExists = await this.tripsService.checkIfTripExists(tripId);
//     //없는 여행일 때 에러 메시지 전송
//     if (!tripExists) {
//       console.error(`Trip with ID ${tripId} does not exist.`);
//       client.emit('roomError', {
//         message: `Trip with ID ${tripId} does not exist.`,
//       });
//       return;
//     }
//     client.join(tripId.toString()); // 소켓을 특정 방에 참여시킴
//     client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림
//     const detailTrip = await this.detailTripService.getDetailTrip(data.room, 1); //처음 랜더링시 1일차로 고정
//     client.emit("detailTripList", detailTrip);
//   }
//   @SubscribeMessage('getDetailTripList')
//   async getDetailTripList(
//     @MessageBody() data: { room: number, day: number },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     const detailTrip = await this.detailTripService.getDetailTrip(data.room, data.day);
//     client.emit("detailTripList", detailTrip);
//   }
//   //상세 여행 생성
//   @SubscribeMessage('createDetailTrip')
//   async createDetailTrip(
//     @MessageBody() data: { createDetailTrip: CreateDetailTripDto },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     const newData = await this.detailTripService.createDetailTrip(data.createDetailTrip);
//     const existData = await this.detailTripService.getDetailTrip(data.createDetailTrip.tripId, data.createDetailTrip.day);
//     client.emit('detailTripCreated', existData);
//     this.server.to(data.createDetailTrip.tripId.toString()).emit('detailTripCreated', existData);
//   }
//   //상세 여행 순서 바꿈
//   @SubscribeMessage('updateOrder')
//   async updateOrder(
//     @MessageBody() data: { tripId: number, updatedList: { id: number, order: number }[], day: number },
//     @ConnectedSocket() client: Socket
//   ) {
//     const { tripId, updatedList, day } = data;
//     for (const item of updatedList) {
//       await this.detailTripService.updateOrder(item.id, item.order);
//     }
//     const updatedTripList = await this.detailTripService.getDetailTrip(tripId, day);
//     client.emit('orderUpdated', updatedTripList);
//     this.server.to(tripId.toString()).emit('orderUpdated', updatedTripList);
//   }
//   @SubscribeMessage('updateTrip')
//   async updateTrip(
//     @MessageBody() data: {id: number, updateDetailTrip: CreateDetailTripDto},
//     @ConnectedSocket() client: Socket
//   ) {
//     const {id, updateDetailTrip} = data;
//     await this.detailTripService.updateTrip(id, updateDetailTrip);
//     const updatedTripList = await this.detailTripService.getDetailTrip(updateDetailTrip.tripId, updateDetailTrip.day);
//     client.emit('detailTripUpdated', updatedTripList);
//     this.server.to(updateDetailTrip.tripId.toString()).emit('detailTripUpdated', updatedTripList);
//   }
//   @SubscribeMessage('deleteDetailTrip')
//   async deleteDetailTrip(
//     @MessageBody() data: { id: number, tripId: number, day: number },
//     @ConnectedSocket() client: Socket
//   ) {
//     const {id, tripId, day} = data;
//     await this.detailTripService.deleteDetailTrip(id);
//     const updatedTripList = await this.detailTripService.getDetailTrip(tripId, day);
//     client.emit('deleteUpdated', updatedTripList);
//     this.server.to(tripId.toString()).emit('deleteUpdated', updatedTripList);
//   }
// }
var websockets_1 = require("@nestjs/websockets");
var DetailTripGateway = /** @class */ (function () {
    function DetailTripGateway(tripsService, // TripsService 주입
    detailTripService) {
        this.tripsService = tripsService;
        this.detailTripService = detailTripService;
    }
    DetailTripGateway.prototype.handleConnection = function (client) {
        console.log("Client connected: " + client.id);
    };
    DetailTripGateway.prototype.handleDisconnect = function (client) {
        console.log("Client disconnected: " + client.id);
    };
    DetailTripGateway.prototype.handleJoinRoom = function (data, // 메시지 바디에서 room 정보를 받음
    client) {
        return __awaiter(this, void 0, void 0, function () {
            var tripId, tripExists, detailTrip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Welcome to " + data.room);
                        tripId = data.room;
                        return [4 /*yield*/, this.tripsService.checkIfTripExists(tripId)];
                    case 1:
                        tripExists = _a.sent();
                        //없는 여행일 때 에러 메시지 전송
                        if (!tripExists) {
                            console.error("Trip with ID " + tripId + " does not exist.");
                            client.emit('roomError', {
                                message: "Trip with ID " + tripId + " does not exist."
                            });
                            return [2 /*return*/];
                        }
                        client.join(tripId.toString()); // 소켓을 특정 방에 참여시킴
                        client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림
                        return [4 /*yield*/, this.detailTripService.getDetailTrip(data.room, 1)];
                    case 2:
                        detailTrip = _a.sent();
                        client.emit('detailTripList', detailTrip);
                        return [2 /*return*/];
                }
            });
        });
    };
    DetailTripGateway.prototype.getDetailTripList = function (data, // 메시지 바디에서 room 정보를 받음
    client) {
        return __awaiter(this, void 0, void 0, function () {
            var detailTrip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.detailTripService.getDetailTrip(data.room, data.day)];
                    case 1:
                        detailTrip = _a.sent();
                        client.emit('detailTripList', detailTrip);
                        return [2 /*return*/];
                }
            });
        });
    };
    //상세 여행 생성
    DetailTripGateway.prototype.createDetailTrip = function (createDetailTrip, // 메시지 바디에서 room 정보를 받음
    client) {
        return __awaiter(this, void 0, void 0, function () {
            var newData, existData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.detailTripService.createDetailTrip(createDetailTrip)];
                    case 1:
                        newData = _a.sent();
                        return [4 /*yield*/, this.detailTripService.getDetailTrip(createDetailTrip.tripId, createDetailTrip.day)];
                    case 2:
                        existData = _a.sent();
                        client.emit('detailTripCreated', existData);
                        this.server
                            .to(createDetailTrip.tripId.toString())
                            .emit('detailTripCreated', existData);
                        return [2 /*return*/];
                }
            });
        });
    };
    //상세 여행 순서 바꿈
    DetailTripGateway.prototype.updateOrder = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var tripId, updatedList, day, _i, updatedList_1, item, updatedTripList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tripId = data.tripId, updatedList = data.updatedList, day = data.day;
                        _i = 0, updatedList_1 = updatedList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updatedList_1.length)) return [3 /*break*/, 4];
                        item = updatedList_1[_i];
                        return [4 /*yield*/, this.detailTripService.updateOrder(item.id, item.order)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.detailTripService.getDetailTrip(tripId, day)];
                    case 5:
                        updatedTripList = _a.sent();
                        client.emit('orderUpdated', updatedTripList);
                        this.server.to(tripId.toString()).emit('orderUpdated', updatedTripList);
                        return [2 /*return*/];
                }
            });
        });
    };
    DetailTripGateway.prototype.updateTrip = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updateDetailTrip, updatedTripList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.id, updateDetailTrip = data.updateDetailTrip;
                        return [4 /*yield*/, this.detailTripService.updateTrip(id, updateDetailTrip)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.detailTripService.getDetailTrip(updateDetailTrip.tripId, updateDetailTrip.day)];
                    case 2:
                        updatedTripList = _a.sent();
                        client.emit('detailTripUpdated', updatedTripList);
                        this.server
                            .to(updateDetailTrip.tripId.toString())
                            .emit('detailTripUpdated', updatedTripList);
                        return [2 /*return*/];
                }
            });
        });
    };
    DetailTripGateway.prototype.deleteDetailTrip = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var id, tripId, day, updatedTripList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = data.id, tripId = data.tripId, day = data.day;
                        return [4 /*yield*/, this.detailTripService.deleteDetailTrip(id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.detailTripService.getDetailTrip(tripId, day)];
                    case 2:
                        updatedTripList = _a.sent();
                        client.emit('deleteUpdated', updatedTripList);
                        this.server.to(tripId.toString()).emit('deleteUpdated', updatedTripList);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], DetailTripGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('joinRoom'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "handleJoinRoom");
    __decorate([
        websockets_1.SubscribeMessage('getDetailTripList'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "getDetailTripList");
    __decorate([
        websockets_1.SubscribeMessage('createDetailTrip'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "createDetailTrip");
    __decorate([
        websockets_1.SubscribeMessage('updateOrder'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "updateOrder");
    __decorate([
        websockets_1.SubscribeMessage('updateTrip'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "updateTrip");
    __decorate([
        websockets_1.SubscribeMessage('deleteDetailTrip'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], DetailTripGateway.prototype, "deleteDetailTrip");
    DetailTripGateway = __decorate([
        websockets_1.WebSocketGateway({
            namespace: '/detailTrip',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true
            }
        })
    ], DetailTripGateway);
    return DetailTripGateway;
}());
exports.DetailTripGateway = DetailTripGateway;
