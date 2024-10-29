"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Trip = void 0;
var typeorm_1 = require("typeorm");
// import { Expense } from '../../getPostExpense/expense.entity';
// import { Expense } from 'src/expenses/expenses.entity';
var member_entity_1 = require("src/member/entities/member.entity");
var participant_entity_1 = require("src/participants/participant.entity");
var expenses_entity_1 = require("../expenses/expenses.entity");
var Trip = /** @class */ (function () {
    function Trip() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Trip.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Trip.prototype, "name");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Trip.prototype, "start_date");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Trip.prototype, "end_date");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 5 }) //char 5글자로 08:30
    ], Trip.prototype, "start_time");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 5 }) //14:50 24시간제로 받음
    ], Trip.prototype, "end_time");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], Trip.prototype, "is_deleted");
    __decorate([
        typeorm_1.OneToMany(function () { return expenses_entity_1.Expense; }, function (expense) { return expense.trip; }) // 1:N 관계
    ], Trip.prototype, "expenses");
    __decorate([
        typeorm_1.ManyToOne(function () { return member_entity_1.Member; }, function (member) { return member.trips; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'memberId' }) // 외래 키 컬럼 명시적으로 설정
    ], Trip.prototype, "member");
    __decorate([
        typeorm_1.OneToMany(function () { return participant_entity_1.Participants; }, function (participants) { return participants.trip; })
    ], Trip.prototype, "participants");
    Trip = __decorate([
        typeorm_1.Entity()
    ], Trip);
    return Trip;
}());
exports.Trip = Trip;
