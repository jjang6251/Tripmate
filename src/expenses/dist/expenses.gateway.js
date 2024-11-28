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
exports.ExpensesGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/chat/chat.guard';
var ExpensesGateway = /** @class */ (function () {
    function ExpensesGateway(expensesService, tripsService) {
        this.expensesService = expensesService;
        this.tripsService = tripsService;
    }
    ExpensesGateway.prototype.handleFilterExpensesByDay = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var tripId, day, filteredExpenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tripId = data.tripId, day = data.day;
                        return [4 /*yield*/, this.expensesService.getExpensesByDay(tripId, day)];
                    case 1:
                        filteredExpenses = _a.sent();
                        // 클라이언트에 필터링된 경비 목록 전송
                        client.emit('filteredExpenses', filteredExpenses);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExpensesGateway.prototype.handleGetAllExpenses = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var expenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expensesService.getExpensesByTrip(data.tripId)];
                    case 1:
                        expenses = _a.sent();
                        client.emit('expenseList', expenses);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 클라이언트가 방에 입장
    ExpensesGateway.prototype.handleJoinRoom = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var tripId, tripExists, expenses, total, tripDate;
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
                        return [4 /*yield*/, this.expensesService.getTotalExpenseByTrip(tripId)];
                    case 3:
                        total = _a.sent();
                        client.emit('totalExpense', { tripId: tripId, total: total });
                        return [4 /*yield*/, this.expensesService.getTripDate(data.room)];
                    case 4:
                        tripDate = _a.sent();
                        client.emit('calculateDate', tripDate); // 숫자가 전송됨
                        return [2 /*return*/];
                }
            });
        });
    };
    ExpensesGateway.prototype.handleCreateExpense = function (payload, client) {
        return __awaiter(this, void 0, void 0, function () {
            var newExpense, updatedExpenses, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!payload.tripId) {
                            console.error('Trip ID가 전달되지 않았습니다.');
                            client.emit('error', { message: 'Trip ID가 누락되었습니다.' });
                            return [2 /*return*/];
                        }
                        // 입력 데이터 검증
                        if (!payload.expenseData.price ||
                            !payload.expenseData.category ||
                            !payload.expenseData.description ||
                            !payload.expenseData.day) {
                            console.log('빈 값이 있어서 추가 안 함.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.expensesService.createExpense(payload.tripId, payload.expenseData)];
                    case 1:
                        newExpense = _a.sent();
                        return [4 /*yield*/, this.expensesService.getExpensesByDay(payload.tripId, payload.expenseData.day)];
                    case 2:
                        updatedExpenses = _a.sent();
                        response = {
                            newExpense: newExpense,
                            updatedExpenses: updatedExpenses
                        };
                        // 클라이언트에 응답 전송
                        client.emit('expenseCreated', response);
                        // 클라이언트에 응답 전송을 모든 클라이언트로 변경
                        this.server.to(payload.tripId.toString()).emit('expenseCreated', response);
                        return [2 /*return*/];
                }
            });
        });
    };
    // @SubscribeMessage('editExpense')
    // async handleEditExpense(
    //   @MessageBody()
    //   payload: {
    //     tripId: number;
    //     expenseId: number;
    //     expenseData: CreateExpenseDto;
    //   },
    //   @ConnectedSocket() client: Socket,
    // ) {
    //   try {
    //     // 경비 수정
    //     await this.expensesService.editExpense(
    //       payload.expenseId,
    //       payload.expenseData,
    //     );
    //     // payload.expenseData.day가 null이면 전체 경비, 그렇지 않으면 해당 day의 경비 조회
    //     const updatedExpenses = payload.expenseData.day
    //       ? await this.expensesService.getExpensesByDay(
    //           payload.tripId,
    //           payload.expenseData.day,
    //         )
    //       : await this.expensesService.getExpensesByTrip(payload.tripId);
    //     // 모든 클라이언트에 업데이트된 경비 목록 전송
    //     client.emit('expenseList', updatedExpenses);
    //     this.server
    //       .to(payload.tripId.toString())
    //       .emit('expenseList', updatedExpenses);
    //   } catch (error) {
    //     console.error('Error editing expense:', error);
    //     client.emit('error', { message: 'Failed to edit expense.' });
    //   }
    // }
    ExpensesGateway.prototype.handleEditExpense = function (payload, client) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedExpenses_1, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        // 경비 수정
                        return [4 /*yield*/, this.expensesService.editExpense(payload.expenseId, payload.expenseData)];
                    case 1:
                        // 경비 수정
                        _b.sent();
                        if (!payload.expenseData.day) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.expensesService.getExpensesByDay(payload.tripId, payload.expenseData.day)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.expensesService.getExpensesByTrip(payload.tripId)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        updatedExpenses_1 = _a;
                        // 해당 tripId에 연결된 소켓 중에서 같은 일차(day)를 보고 있는 소켓에게만 이벤트 전송
                        this.server.sockets.sockets.forEach(function (connectedSocket) {
                            if (connectedSocket.data.tripId === payload.tripId &&
                                connectedSocket.data.currentDay === payload.expenseData.day) {
                                connectedSocket.emit('expenseList', updatedExpenses_1);
                            }
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        console.error('Error editing expense:', error_1);
                        client.emit('error', { message: 'Failed to edit expense.' });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // @SubscribeMessage('deleteExpense')
    // async handleDeleteExpense(
    //   @MessageBody()
    //   data: { expenseId: number; tripId: number; day: number | null },
    //   @ConnectedSocket() client: Socket,
    // ) {
    //   const { expenseId, tripId, day } = data;
    //   try {
    //     // 경비 삭제
    //     const deletedExpense =
    //       await this.expensesService.deleteExpense(expenseId);
    //     if (deletedExpense) {
    //       // day가 null이면 전체 경비, 그렇지 않으면 해당 day 경비 조회
    //       const updatedExpenses = day
    //         ? await this.expensesService.getExpensesByDay(tripId, day)
    //         : await this.expensesService.getExpensesByTrip(tripId);
    //       // 모든 클라이언트에 업데이트된 경비 목록 전송
    //       client.emit('expenseList', updatedExpenses);
    //       this.server.to(tripId.toString()).emit('expenseList', updatedExpenses);
    //     } else {
    //       client.emit('error', {
    //         message: 'Expense not found or already deleted.',
    //       });
    //     }
    //   } catch (error) {
    //     console.error('Error deleting expense:', error);
    //     client.emit('error', { message: 'Failed to delete expense.' });
    //   }
    // }
    ExpensesGateway.prototype.handleDeleteExpense = function (data, client) {
        return __awaiter(this, void 0, void 0, function () {
            var expenseId, tripId, day, deletedExpense, updatedExpenses_2, _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expenseId = data.expenseId, tripId = data.tripId, day = data.day;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.expensesService.deleteExpense(expenseId)];
                    case 2:
                        deletedExpense = _b.sent();
                        if (!deletedExpense) return [3 /*break*/, 7];
                        if (!day) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.expensesService.getExpensesByDay(tripId, day)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.expensesService.getExpensesByTrip(tripId)];
                    case 5:
                        _a = _b.sent();
                        _b.label = 6;
                    case 6:
                        updatedExpenses_2 = _a;
                        // 현재 tripId와 day에 연결된 클라이언트들에게만 이벤트 전송
                        this.server.sockets.sockets.forEach(function (connectedSocket) {
                            if (connectedSocket.data.tripId === tripId &&
                                connectedSocket.data.currentDay === day) {
                                connectedSocket.emit('expenseList', updatedExpenses_2);
                            }
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        client.emit('error', {
                            message: 'Expense not found or already deleted.'
                        });
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        console.error('Error deleting expense:', error_2);
                        client.emit('error', { message: 'Failed to delete expense.' });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
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
    ExpensesGateway.prototype.handleUpdateCurrentDay = function (data, client) {
        var tripId = data.tripId, currentDay = data.currentDay;
        // 클라이언트의 현재 일차를 socket 객체에 저장
        client.data.currentDay = currentDay;
        client.data.tripId = tripId;
        console.log("Client " + client.id + " updated currentDay to " + currentDay + " in trip " + tripId);
    };
    __decorate([
        websockets_1.WebSocketServer()
    ], ExpensesGateway.prototype, "server");
    __decorate([
        websockets_1.SubscribeMessage('filterExpensesByDay'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleFilterExpensesByDay");
    __decorate([
        websockets_1.SubscribeMessage('getAllExpenses'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleGetAllExpenses");
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
    __decorate([
        websockets_1.SubscribeMessage('updateCurrentDay'),
        __param(0, websockets_1.MessageBody()),
        __param(1, websockets_1.ConnectedSocket())
    ], ExpensesGateway.prototype, "handleUpdateCurrentDay");
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
    ], ExpensesGateway);
    return ExpensesGateway;
}());
exports.ExpensesGateway = ExpensesGateway;
