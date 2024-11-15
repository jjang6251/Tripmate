"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PreparationsModule = void 0;
// src/preparations/preparations.module.ts
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var preparation_entity_1 = require("./preparation.entity");
var trip_module_1 = require("../trips/trip.module"); // TripsModule 추가
var preparations_service_1 = require("./preparations.service");
var preparations_gateway_1 = require("./preparations.gateway");
var trip_entity_1 = require("src/trips/trip.entity");
var PreparationsModule = /** @class */ (function () {
    function PreparationsModule() {
    }
    PreparationsModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([preparation_entity_1.PreparationItem, trip_entity_1.Trip]), trip_module_1.TripsModule],
            providers: [preparations_service_1.PreparationsService, preparations_gateway_1.PreparationsGateway],
            exports: [preparations_service_1.PreparationsService]
        })
    ], PreparationsModule);
    return PreparationsModule;
}());
exports.PreparationsModule = PreparationsModule;
