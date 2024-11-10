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
exports.TripsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var auth_guard_1 = require("src/auth/auth.guard");
var get_user_decorator_1 = require("src/auth/get-user.decorator");
// import { User } from 'src/auth/user.entity';
// import { GetUser } from '../auth/get-user.decorator';
// import { AuthGuard } from '@nestjs/passport';
var TripsController = /** @class */ (function () {
    function TripsController(tripsService) {
        this.tripsService = tripsService;
    }
    TripsController.prototype.createTrip = function (createTripDto, member) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, onlyTripData, trip_id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.tripsService.createTrip(createTripDto, member)];
                    case 1:
                        _a = _b.sent(), onlyTripData = _a.onlyTripData, trip_id = _a.trip_id;
                        console.log('member:', member);
                        return [2 /*return*/, {
                                data: {
                                    trip: onlyTripData,
                                    trip_id: trip_id
                                },
                                status: 201,
                                message: 'Trip created successfully'
                            }];
                }
            });
        });
    };
    // @Get()
    // @UseGuards(AuthGuard)
    // @ApiOperation({
    //   summary: 'Get all trips',
    //   description: '모든 여행을 가져옵니다.',
    // })
    // @ApiResponse({
    //   status: 200,
    //   description: 'Get all trips',
    //   schema: {
    //     example: {
    //       trips: [
    //         {
    //           id: 'n',
    //           name: 'Trip',
    //           location: 'Location',
    //           start_date: 'yyyy-mm-dd',
    //           end_date: 'yyyy-mm-dd',
    //           // is_deleted: 'false',
    //           // create_at: 'yyyy-mm-dd',
    //           // update_at: 'yyyy-mm-dd',
    //         },
    //       ],
    //     },
    //   },
    // })
    // async getAllTrips(@GetUser() member: Member) {
    //   // 내가 생성한 여행만 가져옴
    //   const trips = await this.tripsService.getAllTrips(member);
    //   return { trips, status: 200, message: 'Trips fetched successfully' };
    // }
    TripsController.prototype.getPersonalTrips = function (member) {
        return __awaiter(this, void 0, void 0, function () {
            var trips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsService.getPersonalTrips(member)];
                    case 1:
                        trips = _a.sent();
                        return [2 /*return*/, { trips: trips }];
                }
            });
        });
    };
    TripsController.prototype.getGroupTrips = function (member) {
        return __awaiter(this, void 0, void 0, function () {
            var trips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsService.getGroupTrips(member)];
                    case 1:
                        trips = _a.sent();
                        return [2 /*return*/, { trips: trips }];
                }
            });
        });
    };
    TripsController.prototype.getTripsForParticipant = function (member) {
        return __awaiter(this, void 0, void 0, function () {
            var trips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsService.getTripsForParticipant(member)];
                    case 1:
                        trips = _a.sent();
                        return [2 /*return*/, { trips: trips }];
                }
            });
        });
    };
    TripsController.prototype.updateTrip = function (tripId, updateTripDto) {
        return __awaiter(this, void 0, Promise, function () {
            var trip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsService.updateTrip(tripId, updateTripDto)];
                    case 1:
                        trip = _a.sent();
                        return [2 /*return*/, {
                                data: trip,
                                status: 200,
                                message: 'Trip updated successfully'
                            }];
                }
            });
        });
    };
    TripsController.prototype.deleteTrip = function (tripId, member) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsService.deleteTrip(tripId, member)];
                    case 1:
                        _a.sent(); // trip 삭제 처리
                        return [2 /*return*/, {
                                data: { id: tripId },
                                status: 200,
                                message: 'Trip deleted successfully'
                            }];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        swagger_1.ApiOperation({
            summary: 'Create a new trip',
            description: '새로운 여행을 생성합니다.'
        }),
        swagger_1.ApiResponse({
            status: 201,
            description: 'The trip has been successfully created.'
        }),
        __param(0, common_1.Body()),
        __param(1, get_user_decorator_1.GetUser())
    ], TripsController.prototype, "createTrip");
    __decorate([
        common_1.Get('checkpersonaltrips') //내 여행 중에서 1명만 있는 것, 개인 일정
        ,
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, get_user_decorator_1.GetUser())
    ], TripsController.prototype, "getPersonalTrips");
    __decorate([
        common_1.Get('checkgrouptrips') //단체 일정 조회하기
        ,
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, get_user_decorator_1.GetUser())
    ], TripsController.prototype, "getGroupTrips");
    __decorate([
        common_1.Get('checkmytrips') // 내가 참여한 모든 여행 가져오기
        ,
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, get_user_decorator_1.GetUser())
    ], TripsController.prototype, "getTripsForParticipant");
    __decorate([
        common_1.Put(':trip_id'),
        swagger_1.ApiOperation({
            summary: 'Update a trip',
            description: '여행을 수정합니다.'
        }),
        __param(0, common_1.Param('trip_id')),
        __param(1, common_1.Body())
    ], TripsController.prototype, "updateTrip");
    __decorate([
        common_1.Delete(':trip_id'),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        swagger_1.ApiOperation({
            summary: 'Delete a trip',
            description: '여행을 삭제합니다.'
        }),
        __param(0, common_1.Param('trip_id')),
        __param(1, get_user_decorator_1.GetUser())
    ], TripsController.prototype, "deleteTrip");
    TripsController = __decorate([
        swagger_1.ApiTags('trips'),
        swagger_1.ApiBearerAuth('access-token') // Bearer 토큰 사용 명시
        ,
        common_1.Controller('trips')
    ], TripsController);
    return TripsController;
}());
exports.TripsController = TripsController;
