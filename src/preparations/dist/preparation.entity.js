"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PreparationItem = void 0;
var typeorm_1 = require("typeorm");
var trip_entity_1 = require("../trips/trip.entity");
var PreparationItem = /** @class */ (function () {
    function PreparationItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], PreparationItem.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], PreparationItem.prototype, "item");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], PreparationItem.prototype, "isChecked");
    __decorate([
        typeorm_1.ManyToOne(function () { return trip_entity_1.Trip; }, function (trip) { return trip.preparationItems; }, { onDelete: 'CASCADE' })
    ], PreparationItem.prototype, "trip");
    PreparationItem = __decorate([
        typeorm_1.Entity()
    ], PreparationItem);
    return PreparationItem;
}());
exports.PreparationItem = PreparationItem;
