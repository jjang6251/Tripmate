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
exports.ExpensesGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/chat/chat.guard';
var ExpensesGateway = /** @class */ (function () {
    function ExpensesGateway(expensesService, tripsService) {
        this.expensesService = expensesService;
        this.tripsService = tripsService;
    }
    //   // 소켓 연결 시 호출
    //   @UseGuards(JwtAuthGuard)
    //   handleConnection(client: Socket) {
    //     console.log(`Client connected: ${client.id}`);
    //   }
    //   // 소켓 연결 해제 시 호출
    //   handleDisconnect(client: Socket) {
    //     console.log(`Client disconnected: ${client.id}`);
    //   }
    // 클라이언트가 방에 입장
    ExpensesGateway.prototype.handleJoinRoom = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var tripId, tripExists, expenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Client attempting to join room " + data.room);
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
                        client.join(tripId.toString()); // 해당 방에 소켓을 참여시킴
                        client.emit('joinedRoom', tripId); // 클라이언트에게 성공 메시지
                        console.log("Client joined room " + tripId);
                        return [4 /*yield*/, this.expensesService.getExpensesByTrip(tripId)];
                    case 2:
                        expenses = _a.sent();
                        client.emit('expenseList', expenses); // 클라이언트에 경비 목록 전송
                        console.log("Client joined room " + tripId + " and received expenses");
                        return [2 /*return*/];
                }
            });
        });
    };
    ExpensesGateway.prototype.handleCreateExpense = function (payload, client) {
        return __awaiter(this, void 0, void 0, function () {
            var newExpense, expenseWithSender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('새 경비 데이터:', payload.expenseData);
                        console.log('전달받은 tripId:', payload.tripId);
                        if (!payload.tripId) {
                            console.error('Trip ID가 전달되지 않았습니다.');
                            client.emit('error', { message: 'Trip ID가 누락되었습니다.' });
                            return [2 /*return*/];
                        }
                        // 빈 값이 있는지 확인 자바스크립트에서
                        if (!payload.expenseData.price ||
                            !payload.expenseData.category ||
                            !payload.expenseData.description ||
                            !payload.expenseData.date) {
                            console.log('빈 값이 있습니다. 경비 추가를 건너뜁니다.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.expensesService.createExpense(payload.tripId, payload.expenseData)];
                    case 1:
                        newExpense = _a.sent();
                        expenseWithSender = __assign(__assign({}, newExpense), { sender: client.id });
                        this.server
                            .to(payload.tripId.toString())
                            .emit('expenseCreated', expenseWithSender);
                        console.log('경비가 성공적으로 추가되었습니다:', expenseWithSender);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExpensesGateway.prototype.handleEditExpense = function (payload, client) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedExpense;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expensesService.editExpense(payload.expenseId, payload.expenseData)];
                    case 1:
                        updatedExpense = _a.sent();
                        this.server.to(payload.tripId.toString()).emit('expenseEdited', updatedExpense);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExpensesGateway.prototype.handleDeleteExpense = function (data, // 삭제할 경비 ID와 방 번호 (tripId)
    client) {
        return __awaiter(this, void 0, void 0, function () {
            var expenseId, tripId, deletedExpense, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expenseId = data.expenseId, tripId = data.tripId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.expensesService.deleteExpense(expenseId)];
                    case 2:
                        deletedExpense = _a.sent();
                        if (deletedExpense) {
                            // 해당 방의 모든 클라이언트에게 경비 삭제 알림
                            this.server.to(tripId.toString()).emit('expenseDeleted', expenseId);
                            console.log("Expense with ID " + expenseId + " deleted in room " + tripId);
                        }
                        else {
                            client.emit('error', {
                                message: 'Expense not found or already deleted.'
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error deleting expense:', error_1);
                        client.emit('error', { message: 'Failed to delete expense.' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //경비 총합 반환
    ExpensesGateway.prototype.handleGetTotalExpense = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var total;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expensesService.getTotalExpenseByTrip(data.tripId)];
                    case 1:
                        total = _a.sent();
                        client.emit('totalExpense', { tripId: data.tripId, total: total });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], ExpensesGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('joinRoom'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleJoinRoom");
    __decorate([
        websockets_1.SubscribeMessage('createExpense'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleCreateExpense");
    __decorate([
        websockets_1.SubscribeMessage('editExpense'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleEditExpense");
    __decorate([
        websockets_1.SubscribeMessage('deleteExpense'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleDeleteExpense");
    __decorate([
        websockets_1.SubscribeMessage('getTotalExpense'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleGetTotalExpense");
    ExpensesGateway = __decorate([
        websockets_1.WebSocketGateway({
            namespace: '/expenses',
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true
            }
        })
        //   implements OnGatewayConnection, OnGatewayDisconnect
    ], ExpensesGateway);
    return ExpensesGateway;
}());
exports.ExpensesGateway = ExpensesGateway;
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { Expense } from './expenses.entity';
// @WebSocketGateway({ namespace: '/expenses', cors: { origin: '*' } })
// export class ExpensesGateway {
//   @WebSocketServer() server: Server;
//   constructor(private expensesService: ExpensesService) {}
//   @SubscribeMessage('joinRoom')
//   async handleJoinRoom(
//     @MessageBody() data: { room: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const tripId = data.room;
//     const expenses = await this.expensesService.getExpensesByTrip(tripId);
//     client.join(tripId.toString());
//     client.emit('expenseList', expenses);
//   }
//   @SubscribeMessage('createExpense')
//   async handleCreateExpense(
//     @MessageBody() payload: { tripId: number; expenseData: CreateExpenseDto },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const newExpense = await this.expensesService.createExpense(
//       payload.tripId,
//       payload.expenseData,
//     );
//     this.server.to(payload.tripId.toString()).emit('expenseCreated', newExpense);
//   }
//   @SubscribeMessage('editExpense')
//   async handleEditExpense(
//     @MessageBody()
//     payload: { tripId: number; expenseId: number; expenseData: CreateExpenseDto },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const updatedExpense = await this.expensesService.editExpense(
//       payload.expenseId,
//       payload.expenseData,
//     );
//     this.server.to(payload.tripId.toString()).emit('expenseEdited', updatedExpense);
//   }
//   @SubscribeMessage('deleteExpense')
//   async handleDeleteExpense(
//     @MessageBody() data: { expenseId: number; tripId: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     await this.expensesService.deleteExpense(data.expenseId);
//     this.server.to(data.tripId.toString()).emit('expenseDeleted', data.expenseId);
//   }
// }
