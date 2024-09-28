import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket } from './interface/custom-socket.interface';

export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient<AuthenticatedSocket>();
        const token = client.handshake.auth.token; // 클라이언트에서 전송된 토큰
        console.log(token);
        try {
            const decoded = this.jwtService.verify(token); // 토큰 검증
            client.user = decoded; // 클라이언트에 사용자 정보 저장
            return true;
        } catch (error) {
            console.log('Invalid JWT token', error);
            return false; // 토큰이 유효하지 않으면 연결 차단
        }
    }
}