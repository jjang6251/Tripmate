import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from 'src/member/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemberService } from 'src/member/member.service';
import { WsJwtGuard } from './chat.guard';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [
        MemberModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: '10h' },
            })
        }),
    ],
    providers: [ WsJwtGuard],
    controllers: [],
    exports: [JwtModule],
})
export class ChatModule {

}
