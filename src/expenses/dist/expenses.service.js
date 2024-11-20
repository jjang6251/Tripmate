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
exports.ExpensesService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var trip_entity_1 = require("src/trips/trip.entity");
var expenses_entity_1 = require("./expenses.entity");
var ExpensesService = /** @class */ (function () {
    function ExpensesService(expenseRepository, tripRepository) {
        this.expenseRepository = expenseRepository;
        this.tripRepository = tripRepository;
    }
    //전체 경비, 1일차 경비, 2일차 경비 가져오기
    ExpensesService.prototype.getExpensesByDay = function (tripId, day) {
        return __awaiter(this, void 0, Promise, function () {
            var trip, startDate, targetDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripRepository.findOne({ where: { id: tripId } })];
                    case 1:
                        trip = _a.sent();
                        if (!trip) {
                            throw new Error("Trip with ID " + tripId + " not found");
                        }
                        startDate = new Date(trip.start_date);
                        targetDate = new Date(startDate);
                        targetDate.setDate(startDate.getDate() + (day - 1)); // day에 맞춰 날짜 계산 (1일차는 시작일 그대로)
                        return [4 /*yield*/, this.expenseRepository.find({
                                where: {
                                    trip: { id: tripId },
                                    date: targetDate.toISOString().split('T')[0]
                                }
                            })];
                    case 2: // day에 맞춰 날짜 계산 (1일차는 시작일 그대로)
                    // targetDate와 일치하는 경비 찾기
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //며칠까지 있는 지 계산
    ExpensesService.prototype.getTripDate = function (tripId) {
        return __awaiter(this, void 0, Promise, function () {
            var trip, startDate, endDate, durationInDays;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripRepository.findOne({ where: { id: tripId } })];
                    case 1:
                        trip = _a.sent();
                        if (!trip) {
                            throw new Error('Trip not found');
                        }
                        startDate = new Date(trip.start_date);
                        endDate = new Date(trip.end_date);
                        durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                        return [2 /*return*/, Math.ceil(durationInDays + 1)];
                }
            });
        });
    };
    ExpensesService.prototype.editExpense = function (expenseId, expenseData) {
        return __awaiter(this, void 0, Promise, function () {
            var expense;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expenseRepository.findOne({
                            where: { id: expenseId }
                        })];
                    case 1:
                        expense = _a.sent();
                        if (!expense) {
                            throw new common_1.NotFoundException('Expense not found');
                        }
                        Object.assign(expense, expenseData);
                        return [2 /*return*/, this.expenseRepository.save(expense)];
                }
            });
        });
    };
    // 경비 생성 메서드
    ExpensesService.prototype.createExpense = function (tripId, createExpenseDto) {
        return __awaiter(this, void 0, Promise, function () {
            var trip, date, formattedDate, expense;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripRepository.findOne({ where: { id: tripId } })];
                    case 1:
                        trip = _a.sent();
                        if (!trip) {
                            throw new Error('Trip not found');
                        }
                        date = new Date(trip.start_date);
                        date.setDate(date.getDate() + (createExpenseDto.day - 1));
                        formattedDate = date.toISOString().split('T')[0];
                        expense = this.expenseRepository.create({
                            trip: trip,
                            price: Number(createExpenseDto.price),
                            category: createExpenseDto.category,
                            description: createExpenseDto.description,
                            date: formattedDate
                        });
                        return [4 /*yield*/, this.expenseRepository.save(expense)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // 경비 조회 Get 메서드
    ExpensesService.prototype.getExpensesByTrip = function (tripId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.expenseRepository.find({
                        where: { trip: { id: tripId } }
                    })];
            });
        });
    };
    //경비 삭제 메서드
    ExpensesService.prototype.deleteExpense = function (expenseId) {
        return __awaiter(this, void 0, Promise, function () {
            var expense;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expenseRepository.findOne({
                            where: { id: expenseId }
                        })];
                    case 1:
                        expense = _a.sent();
                        if (!expense) {
                            return [2 /*return*/, null]; // 경비가 존재하지 않으면 null 반환
                        }
                        return [4 /*yield*/, this.expenseRepository.remove(expense)];
                    case 2:
                        _a.sent(); // 경비 삭제
                        return [2 /*return*/, expense]; // 삭제된 경비 반환
                }
            });
        });
    };
    // 총합 계산 메서드
    ExpensesService.prototype.getTotalExpenseByTrip = function (tripId) {
        return __awaiter(this, void 0, Promise, function () {
            var expenses, total;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.expenseRepository.find({
                            where: { trip: { id: tripId } }
                        })];
                    case 1:
                        expenses = _a.sent();
                        total = expenses.reduce(function (sum, expense) { return sum + Number(expense.price); }, 0);
                        return [2 /*return*/, total];
                }
            });
        });
    };
    ExpensesService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(expenses_entity_1.Expense)),
        __param(1, typeorm_1.InjectRepository(trip_entity_1.Trip))
    ], ExpensesService);
    return ExpensesService;
}());
exports.ExpensesService = ExpensesService;
