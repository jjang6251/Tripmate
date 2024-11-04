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
exports.ParticipantsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var participant_entity_1 = require("./participant.entity");
var member_entity_1 = require("src/member/entities/member.entity");
var trip_entity_1 = require("src/trips/trip.entity");
var ParticipantsService = /** @class */ (function () {
    function ParticipantsService(participantsRepository, membersRepository, tripsRepository) {
        this.participantsRepository = participantsRepository;
        this.membersRepository = membersRepository;
        this.tripsRepository = tripsRepository;
    }
    // 본인이 여행에서 나가기
    ParticipantsService.prototype.deleteParticipants = function (escaper, tripId) {
        return __awaiter(this, void 0, Promise, function () {
            var participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.participantsRepository.findOne({
                            where: { trip: { id: tripId }, member: { userid: escaper.userid } }
                        })];
                    case 1:
                        participant = _a.sent();
                        console.log(participant); // 확인용 로그
                        // 여행에서 참가자를 찾을 수 없으면 예외 처리
                        if (!participant) {
                            throw new common_1.NotFoundException("\uC5EC\uD589 " + tripId + "\uC5D0\uC11C " + escaper.userid + " \uCC38\uAC00\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
                        }
                        // 본인이 해당 여행에서 탈주하기
                        return [4 /*yield*/, this.participantsRepository.remove(participant)];
                    case 2:
                        // 본인이 해당 여행에서 탈주하기
                        _a.sent();
                        console.log(
                        // 확인용 로그
                        "\uC5EC\uD589 " + tripId + "\uC5D0\uC11C " + escaper.userid + " \uCC38\uAC00\uC790\uB97C \uC131\uACF5\uC801\uC73C\uB85C \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4.");
                        return [2 /*return*/];
                }
            });
        });
    };
    //초대할 회원이 멤버 데이터베이스에 있는지 확인
    ParticipantsService.prototype.findParticipantsInMember = function (searchedname) {
        return __awaiter(this, void 0, Promise, function () {
            var foundMembers, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        foundMembers = [];
                        return [4 /*yield*/, this.membersRepository.findOne({
                                where: { userid: searchedname }
                            })];
                    case 1:
                        member = _a.sent();
                        if (member) {
                            foundMembers.push(member); // 회원이 존재하면 배열에 추가
                            console.log('foundMembers:', foundMembers); // 확인용 로그
                            console.log('\n\n\n'); // 확인용 로그
                            return [2 /*return*/, {
                                    userid: member.userid,
                                    useremail: member.useremail
                                }];
                        }
                        else {
                            //없으면 예외 발생
                            throw new common_1.NotFoundException("\uCD08\uB300\uD558\uB824\uB294 \uC0AC\uB78C (" + searchedname + ")\uC774 \uB370\uC774\uD130\uBCA0\uC774\uC2A4\uC5D0 \uC5C6\uC2B5\uB2C8\uB2E4.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ParticipantsService.prototype.addParticipantsToTrip = function (tripId, memberIds, // 초대할 회원의 ID 배열
    inviter) {
        return __awaiter(this, void 0, Promise, function () {
            var trip, existingParticipants, inviterIsParticipant, membersToInvite, _i, membersToInvite_1, member, participant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tripsRepository.findOne({ where: { id: tripId } })];
                    case 1:
                        trip = _a.sent();
                        if (!trip) {
                            throw new common_1.NotFoundException(" " + tripId + "\uBC88 \uC5EC\uD589\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
                        }
                        return [4 /*yield*/, this.participantsRepository.find({
                                where: {
                                    trip: { id: tripId }
                                }
                            })];
                    case 2:
                        existingParticipants = _a.sent();
                        console.log(existingParticipants); // 확인용 로그
                        inviterIsParticipant = existingParticipants.some(function (participant) { return participant.userid === inviter.userid; });
                        if (!inviterIsParticipant) {
                            // 초대자가 해당 여행에 속해 있지 않으면 예외 처리
                            // 그럴 일은 없음... 여행을 만든 사람이라면 무조건 속해 있음
                            throw new common_1.UnauthorizedException('권한이 없습니다.');
                        }
                        return [4 /*yield*/, this.membersRepository.find({
                                where: {
                                    userid: typeorm_2.In(memberIds)
                                }
                            })];
                    case 3:
                        membersToInvite = _a.sent();
                        // 초대할 회원 중 일부가 존재하지 않으면 예외 처리
                        if (membersToInvite.length !== memberIds.length) {
                            // 이미 조회를 해서 배열에 들어왔으므로 실행될 일은 없을 듯...
                            throw new common_1.NotFoundException('일부 회원을 찾을 수 없습니다.');
                        }
                        _i = 0, membersToInvite_1 = membersToInvite;
                        _a.label = 4;
                    case 4:
                        if (!(_i < membersToInvite_1.length)) return [3 /*break*/, 7];
                        member = membersToInvite_1[_i];
                        participant = this.participantsRepository.create({
                            trip: trip,
                            member: member,
                            userid: member.userid
                        });
                        return [4 /*yield*/, this.participantsRepository.save(participant)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ParticipantsService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(participant_entity_1.Participants)),
        __param(1, typeorm_1.InjectRepository(member_entity_1.Member)),
        __param(2, typeorm_1.InjectRepository(trip_entity_1.Trip))
    ], ParticipantsService);
    return ParticipantsService;
}());
exports.ParticipantsService = ParticipantsService;
// // 초대하기 메소드
// async addParticipantsToTrip(
//   tripId: number,
//   foundMembers: Member[], // 이미 조회된 회원들 배열
//   inviterId: Member,
// ): Promise<void> {
//   // 해당 여행을 찾습니다.
//   const trip = await this.tripsRepository.findOne({ where: { id: tripId } });
//   if (!trip) {
//     // 여행이 없으면 예외 발생
//     throw new NotFoundException(`Trip with ID ${tripId} not found`);
//   }
//   // console.log('여행 정보:', trip);
//   // console.log('초대할 회원:', createParticipantsDto.memberIds);
//   // console.log('초대자 정보:', inviterId);
//   // 해당 여행에 속한 모든 참가자를 조회
//   const existingParticipants = await this.participantsRepository.find({
//     where: {
//       trip: { id: tripId },
//     },
//   });
//   // 초대자가 해당 여행에 속해 있는지 확인
//   const inviterIsParticipant = existingParticipants.some(
//     (participant) => participant.userid === inviterId.userid,
//   );
//   console.log('existingParticipants:', existingParticipants); // 확인용 로그
//   if (!inviterIsParticipant) {
//     console.log('권한이 없는 사용자');
//     throw new UnauthorizedException(
//       'You do not have permission to invite members to this trip.',
//     );
//   }
//   // // 여행에 초대할 회원을 찾습니다.
//   // const members = await this.membersRepository.find({
//   //   where: {
//   //     userid: In(createParticipantsDto.memberIds),
//   //   },
//   // });
//   // if (members.length !== createParticipantsDto.memberIds.length) {
//   //   throw new NotFoundException('Some members were not found');
//   // }
//   // 방 번호를 여행(trip_id)에 맞춰 설정
//   // const roomNumber = tripId; // tripId를 방 번호로 사용
//   // 각각의 회원을 participants 테이블에 추가
//   for (const member of foundMembers) {
//     const participant = this.participantsRepository.create({
//       trip: trip,
//       member: member,
//       userid: member.userid // 사용자 닉네임 추가
//       // room_number: roomNumber, // 여행 번호(tripId)를 방 번호로 사용
//     });
//     console.log(`Successfully invited ${member.userid}`);
//     await this.participantsRepository.save(participant);
//   }
// }
// }
