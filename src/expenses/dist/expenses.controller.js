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
exports.__esModule = true;
exports.ExpensesController = void 0;
var common_1 = require("@nestjs/common");
var ExpensesController = /** @class */ (function () {
    function ExpensesController(expensesService) {
        this.expensesService = expensesService;
    }
    ExpensesController.prototype.createExpense = function (tripId, // tripId 가져오기
    createExpenseData) {
        return this.expensesService.createExpense(tripId, createExpenseData); // tripId 추가
    };
    //처음 들어갈 때는 다 보여주고
    ExpensesController.prototype.getExpenses = function (tripId) {
        // 해당 tripId에 대한 경비 데이터를 가져옵니다.
        // return this.expensesService.getExpensesByTrip(tripId);
        return this.expensesService.getTotalExpenseByTrip(tripId);
    };
    __decorate([
        common_1.Post(':trip_id'),
        __param(0, common_1.Param('trip_id')),
        __param(1, common_1.Body())
    ], ExpensesController.prototype, "createExpense");
    __decorate([
        common_1.Get(':tripId/total'),
        __param(0, common_1.Param('tripId'))
    ], ExpensesController.prototype, "getExpenses");
    ExpensesController = __decorate([
        common_1.Controller('expenses')
    ], ExpensesController);
    return ExpensesController;
}());
exports.ExpensesController = ExpensesController;
