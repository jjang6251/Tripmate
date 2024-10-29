"use strict";
exports.__esModule = true;
exports.typeORMConfig = void 0;
var member_entity_1 = require("src/member/entities/member.entity");
var dotenv = require("dotenv");
var trip_entity_1 = require("src/trips/trip.entity");
// import { Expense } from 'getPostExpense/expense.entity';
var expenses_entity_1 = require("src/expenses/expenses.entity");
var participant_entity_1 = require("src/participants/participant.entity");
dotenv.config();
exports.typeORMConfig = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'tripmate',
    entities: [member_entity_1.Member, trip_entity_1.Trip, expenses_entity_1.Expense, participant_entity_1.Participants],
    synchronize: true
};
