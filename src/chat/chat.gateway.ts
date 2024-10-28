import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto/createMessageDto.dto';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedSocket } from './interface/custom-socket.interface';
import { JwtAuthGuard } from './chat.guard';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*', // 모든 도메인에서의 요청을 허용
    methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @UseGuards(JwtAuthGuard)
  handleConnection(client: AuthenticatedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string }, // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket, // 연결된 소켓 정보
  ) {
    console.log(`Welcome to ${data.room}`);
    client.join(data.room); // 소켓을 특정 방에 참여시킴
    client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림
  }
  // 클라이언트가 특정 방에서 나가도록 하는 메서드
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { room: string }, // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket, // 연결된 소켓 정보
  ) {
    client.leave(data.room); // 소켓을 특정 방에서 나가게 함
    client.emit('leftRoom', data.room); // 방에서 성공적으로 나갔음을 클라이언트에게 알림
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const user = client.user;
    console.log(user);
    const message = {
      ...createMessageDto,
      // sender: user.userid
      sender: 'jjang',
    };
    console.log('Message from Room:', message);
    this.server.to(createMessageDto.room).emit('message', message);
  }
}
