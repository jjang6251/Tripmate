"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateTripDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateTripDto = /** @class */ (function () {
    function CreateTripDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: '여행 이름', example: '가족 여행' }),
        class_validator_1.IsString()
    ], CreateTripDto.prototype, "name");
    __decorate([
        swagger_1.ApiProperty({ description: '여행 시작 날짜', example: 'yyyy-mm-dd' }),
        class_validator_1.IsDateString()
    ], CreateTripDto.prototype, "start_date");
    __decorate([
        swagger_1.ApiProperty({ description: '여행 종료 날짜', example: 'yyyy-mm-dd' }),
        class_validator_1.IsDateString()
    ], CreateTripDto.prototype, "end_date");
    __decorate([
        class_validator_1.IsString()
    ], CreateTripDto.prototype, "start_time");
    __decorate([
        class_validator_1.IsString()
    ], CreateTripDto.prototype, "end_time");
    return CreateTripDto;
}());
exports.CreateTripDto = CreateTripDto;
