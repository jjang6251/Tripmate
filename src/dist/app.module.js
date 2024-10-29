"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var member_module_1 = require("./member/member.module");
var auth_controller_1 = require("./auth/auth.controller");
var auth_service_1 = require("./auth/auth.service");
var auth_module_1 = require("./auth/auth.module");
var config_1 = require("@nestjs/config");
var typerorm_config_1 = require("./config/typerorm.config");
var chat_gateway_1 = require("./chat/chat.gateway");
var trip_module_1 = require("./trips/trip.module");
var participants_module_1 = require("./participants/participants.module");
var expenses_module_1 = require("./expenses/expenses.module");
// import { RealExpensesGateway } from './realExpenses/realExpense.gateway';
// import { RealExpenseModule } from './realExpenses/realExpense.module';
// import { RealExpenseModule } from './realExpenses/realExpense.module';
// import { RealExpenseService } from './realExpenses/realExpense.service';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRoot(typerorm_config_1.typeORMConfig),
                member_module_1.MemberModule,
                auth_module_1.AuthModule,
                trip_module_1.TripsModule,
                expenses_module_1.ExpensesModule,
                participants_module_1.ParticipantsModule,
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, chat_gateway_1.ChatGateway]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
