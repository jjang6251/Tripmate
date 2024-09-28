import { Socket } from 'socket.io';

// Socket 인터페이스 확장
export interface AuthenticatedSocket extends Socket {
  user?: any; // 사용자 정보를 추가할 수 있도록 확장 (유형을 정의할 수도 있음)
}
