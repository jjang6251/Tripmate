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
exports.TripsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var trip_entity_1 = require("./trip.entity");
var member_entity_1 = require("src/member/entities/member.entity");
var participant_entity_1 = require("src/participants/participant.entity");
// import { UserRepository } from 'src/auth/user.repository';
// import { User } from 'src/auth/user.entity';
var TripsService = /** @class */ (function () {
    function TripsService(tripsRepository, memberRepository, // MemberRepository 추가
    participantsRepository) {
        this.tripsRepository = tripsRepository;
        this.memberRepository = memberRepository;
        this.participantsRepository = participantsRepository;
    }
    TripsService.prototype.createTrip = function (tripData, memberPayload) {
        return __awaiter(this, void 0, Promise, function () {
            var member, trip, onlyTripData, savedTrip, participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.memberRepository.findOne({
                            where: { id: memberPayload.sub }
                        })];
                    case 1:
                        member = _a.sent();
                        if (!member) {
                            throw new common_1.NotFoundException('Member not found');
                        }
                        trip = this.tripsRepository.create(__assign(__assign({}, tripData), { member: member }));
                        onlyTripData = __assign({}, tripData);
                        return [4 /*yield*/, this.tripsRepository.save(trip)];
                    case 2:
                        savedTrip = _a.sent();
                        participant = this.participantsRepository.create({
                            trip: savedTrip,
                            member: member,
                            userid: member.userid
                        });
                        return [4 /*yield*/, this.participantsRepository.save(participant)];
                    case 3:
                        _a.sent(); // 생성자를 참가자 테이블에 저장
                        return [2 /*return*/, {
                                onlyTripData: onlyTripData,
                                trip_id: savedTrip.id
                            }]; // 생성된 여행 반환
                }
            });
        });
    };
    // //모든 여행 가져오기
    // async getAllTrips(memberPayload: any): Promise<Trip[]> {
    //   // return await this.tripsRepository.find({ where: { member:member,is_deleted: false } });
    //   const member = await this.memberRepository.findOne({
    //     where: { id: memberPayload.sub }, // 적절한 필드로 수정 (예: userid)
    //   });
    //   if (!member) {
    //     throw new NotFoundException('Member not found');
    //   }
    //   return await this.tripsRepository.find({
    //     where: { member: member }, // 해당 회원과 삭제되지 않은 여행만 가져옴
    //   });
    // }
    //개인 일정만 가져오기, 내 여행 중에서 1명만 있는 것
    TripsService.prototype.getPersonalTrips = function (member) {
        return __awaiter(this, void 0, Promise, function () {
            var trips, personalTrips, _i, trips_1, trip, participantCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTripsForParticipant(member)];
                    case 1:
                        trips = _a.sent();
                        personalTrips = [];
                        _i = 0, trips_1 = trips;
                        _a.label = 2;
                    case 2:
                        if (!(_i < trips_1.length)) return [3 /*break*/, 5];
                        trip = trips_1[_i];
                        return [4 /*yield*/, this.participantsRepository.count({
                                where: { trip: { id: trip.id } }
                            })];
                    case 3:
                        participantCount = _a.sent();
                        // 혼자만 있는 경우에 personalTrips에 추가
                        if (participantCount === 1) {
                            personalTrips.push(trip);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        console.log('Personal Trips:', personalTrips);
                        return [2 /*return*/, personalTrips];
                }
            });
        });
    };
    // 회원이 참여자로 포함된 여행을 가져오는 메소드
    TripsService.prototype.getTripsForParticipant = function (member) {
        return __awaiter(this, void 0, Promise, function () {
            var participants, trips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.participantsRepository.find({
                            where: { userid: member.userid },
                            relations: ['trip']
                        })];
                    case 1:
                        participants = _a.sent();
                        // 참가자가 참여한 여행이 없으면 예외 발생, 프론트에서 처리하기?
                        if (participants.length === 0) {
                            throw new common_1.NotFoundException('내가 참여한 여행이 없습니다.');
                        }
                        trips = participants.map(function (participant) { return participant.trip; });
                        return [2 /*return*/, trips];
                }
            });
        });
    };
    TripsService.prototype.updateTrip = function (id, tripData) {
        return __awaiter(this, void 0, Promise, function () {
            var updatedTrip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsRepository.update(id, tripData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.tripsRepository.findOne({
                                where: { id: id }
                            })];
                    case 2:
                        updatedTrip = _a.sent();
                        if (!updatedTrip) {
                            throw new common_1.NotFoundException("Trip with ID " + id + " not found");
                        }
                        return [2 /*return*/, updatedTrip];
                }
            });
        });
    };
    TripsService.prototype.deleteTrip = function (id, member) {
        return __awaiter(this, void 0, Promise, function () {
            var participant, trip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.participantsRepository.findOne({
                            where: { trip: { id: id }, member: { userid: member.userid } }
                        })];
                    case 1:
                        participant = _a.sent();
                        if (!participant) {
                            // 참가자가 아니라면 예외 발생
                            throw new common_1.UnauthorizedException("\uC5EC\uD589\uC758 \uCC38\uC5EC\uC790\uAC00 \uC544\uB2C8\uB77C\uC11C \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
                        }
                        return [4 /*yield*/, this.tripsRepository.findOne({ where: { id: id } })];
                    case 2:
                        trip = _a.sent();
                        if (!trip) {
                            //여행이 없다면 예외...
                            throw new common_1.NotFoundException("Trip with ID " + id + " not found");
                        }
                        // 여행 삭제
                        return [4 /*yield*/, this.tripsRepository.remove(trip)];
                    case 3:
                        // 여행 삭제
                        _a.sent();
                        console.log(id + "\uBC88 \uC5EC\uD589\uC744 \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4. "); // 삭제 확인용 로그
                        return [2 /*return*/];
                }
            });
        });
    };
    TripsService.prototype.checkIfTripExists = function (tripId) {
        return __awaiter(this, void 0, Promise, function () {
            var trip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsRepository.findOne({
                            where: { id: tripId }
                        })];
                    case 1:
                        trip = _a.sent();
                        return [2 /*return*/, trip !== null]; // trip이 null이 아닌 경우 true, null인 경우 false 반환
                }
            });
        });
    };
    TripsService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(trip_entity_1.Trip)),
        __param(1, typeorm_1.InjectRepository(member_entity_1.Member)),
        __param(2, typeorm_1.InjectRepository(participant_entity_1.Participants))
    ], TripsService);
    return TripsService;
}());
exports.TripsService = TripsService;
