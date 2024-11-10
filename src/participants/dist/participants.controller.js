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
exports.ParticipantsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var get_user_decorator_1 = require("src/auth/get-user.decorator");
var auth_guard_1 = require("src/auth/auth.guard");
var ParticipantsController = /** @class */ (function () {
    function ParticipantsController(participantsService) {
        this.participantsService = participantsService;
    }
    // 여행 강퇴
    ParticipantsController.prototype.expelParticipants = function (expeller, //추방 시키는 사람
    tripId, //여행
    expelledname) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!expelledname) {
                            throw new common_1.NotFoundException('강퇴할 닉네임을 입력해주세요.');
                        }
                        return [4 /*yield*/, this.participantsService.expelParticipants(expeller, tripId, expelledname)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //본인이 여행 참여자 목록에서 나가기
    ParticipantsController.prototype.deleteParticipants = function (escaper, tripId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.participantsService.deleteParticipants(escaper, tripId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Member DB에서 친구 검색
    ParticipantsController.prototype.findParticipant = function (searchedname) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!searchedname) {
                            //입력 안 하면
                            throw new common_1.NotFoundException('닉네임을 입력해주세요.');
                        }
                        return [4 /*yield*/, this.participantsService.findParticipantsInMember(searchedname)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // 여행 참여자 초대
    ParticipantsController.prototype.inviteMembers = function (tripId, createParticipantsDto, inviter) {
        return __awaiter(this, void 0, Promise, function () {
            var foundMembers, _i, _a, searchedname;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        foundMembers = [];
                        for (_i = 0, _a = createParticipantsDto.memberIds; _i < _a.length; _i++) {
                            searchedname = _a[_i];
                            foundMembers.push(searchedname); // 멤버가 확인되면 초대할 목록에 추가
                        }
                        // 초대할 멤버가 없으면 예외 처리
                        if (foundMembers.length === 0) {
                            throw new common_1.NotFoundException('초대할 회원이 존재하지 않습니다.');
                        }
                        // 초대 메소드 실행
                        return [4 /*yield*/, this.participantsService.addParticipantsToTrip(tripId, foundMembers, inviter)];
                    case 1:
                        // 초대 메소드 실행
                        _b.sent();
                        return [2 /*return*/, foundMembers];
                }
            });
        });
    };
    __decorate([
        common_1.Delete(':trip_id/expel'),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, get_user_decorator_1.GetUser()),
        __param(1, common_1.Param('trip_id')),
        __param(2, common_1.Query('expelledname'))
    ], ParticipantsController.prototype, "expelParticipants");
    __decorate([
        common_1.Delete(':trip_id/escape'),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, get_user_decorator_1.GetUser()),
        __param(1, common_1.Param('trip_id'))
    ], ParticipantsController.prototype, "deleteParticipants");
    __decorate([
        common_1.Get('searchparticipant'),
        __param(0, common_1.Query('searchedname'))
    ], ParticipantsController.prototype, "findParticipant");
    __decorate([
        common_1.Post(':trip_id/invite'),
        common_1.UseGuards(auth_guard_1.AuthGuard),
        __param(0, common_1.Param('trip_id')),
        __param(1, common_1.Body()),
        __param(2, get_user_decorator_1.GetUser())
    ], ParticipantsController.prototype, "inviteMembers");
    ParticipantsController = __decorate([
        swagger_1.ApiTags('participants'),
        common_1.Controller('participants')
    ], ParticipantsController);
    return ParticipantsController;
}());
exports.ParticipantsController = ParticipantsController;
