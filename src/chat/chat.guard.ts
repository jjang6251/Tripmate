import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // canActivate를 async 함수로 변환하여 비동기 작업 처리
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient(); // WebSocket 클라이언트 가져오기
    const token = client.handshake?.auth?.token?.split(' ')[1]; // Authorization 헤더에서 토큰 추출

    if (!token) {
      throw new WsException('Token not provided'); // 토큰이 없으면 예외 처리
    }

    try {
      // JWT 토큰 검증 (비동기적으로 처리)
      const decoded = await this.jwtService.verifyAsync(token); 
      client.user = decoded; // 검증된 유저 정보 저장
      return true; // Guard 통과
    } catch (err) {
      throw new WsException('Invalid token'); // 토큰이 유효하지 않으면 예외 처리
    }
  }
}
