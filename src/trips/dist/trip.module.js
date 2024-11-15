"use strict";
// import { Module } from '@nestjs/common';
// import { TripsService } from './trip.service';
// import { TripsController } from './trip.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Trip } from './trip.entity';
// import { AuthModule } from 'src/auth/auth.module';
// import { MemberModule } from 'src/member/member.module';
// import { Member } from 'src/member/entities/member.entity';
// import { Participants } from 'src/participants/participant.entity';
// import { Expense } from 'src/expenses/expenses.entity';
// import { ExpensesService } from 'src/expenses/expenses.service';
// import { ExpensesGateway } from 'src/expenses/expenses.gateway';
// import { ExpensesModule } from 'src/expenses/expenses.module';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TripsModule = void 0;
// @Module({
//   imports: [TypeOrmModule.forFeature([Trip, Member, Participants]), AuthModule],
//   controllers: [TripsController],
//   providers: [TripsService],
//   exports: [TripsService,Trip]
// })
// export class TripsModule {}
// src/trips/trip.module.ts
var common_1 = require("@nestjs/common");
var trip_service_1 = require("./trip.service");
var trip_controller_1 = require("./trip.controller");
var typeorm_1 = require("@nestjs/typeorm");
var trip_entity_1 = require("./trip.entity");
var auth_module_1 = require("src/auth/auth.module");
var member_entity_1 = require("src/member/entities/member.entity");
var participant_entity_1 = require("src/participants/participant.entity");
var TripsModule = /** @class */ (function () {
    function TripsModule() {
    }
    TripsModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([trip_entity_1.Trip, member_entity_1.Member, participant_entity_1.Participants]),
                auth_module_1.AuthModule,
            ],
            controllers: [trip_controller_1.TripsController],
            providers: [trip_service_1.TripsService],
            exports: [trip_service_1.TripsService]
        })
    ], TripsModule);
    return TripsModule;
}());
exports.TripsModule = TripsModule;
