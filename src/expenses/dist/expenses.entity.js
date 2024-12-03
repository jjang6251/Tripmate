"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Expense = void 0;
var typeorm_1 = require("typeorm");
var trip_entity_1 = require("src/trips/trip.entity");
var Expense = /** @class */ (function () {
    function Expense() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Expense.prototype, "id");
    __decorate([
        typeorm_1.Column('decimal')
    ], Expense.prototype, "price");
    __decorate([
        typeorm_1.Column()
    ], Expense.prototype, "category");
    __decorate([
        typeorm_1.Column()
    ], Expense.prototype, "description");
    __decorate([
        typeorm_1.Column()
    ], Expense.prototype, "date");
    __decorate([
        typeorm_1.ManyToOne(function () { return trip_entity_1.Trip; }, function (trip) { return trip.expenses; }, { onDelete: 'CASCADE' })
    ], Expense.prototype, "trip");
    __decorate([
        typeorm_1.Column()
    ], Expense.prototype, "day");
    Expense = __decorate([
        typeorm_1.Entity()
    ], Expense);
    return Expense;
}());
exports.Expense = Expense;
