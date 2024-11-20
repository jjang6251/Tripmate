// src/preparations/preparations.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PreparationsService } from './preparations.service';
import { TripsService } from 'src/trips/trip.service';
import { CreatePreparationDto } from './dto/create-preparation.dto';

@WebSocketGateway({
  namespace: '/preparations', // /expenses 네임스페이스 사용
  cors: {
    origin: '*', // 모든 도메인에서의 요청을 허용
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
})
export class PreparationsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private preparationsService: PreparationsService,
    private tripsService: TripsService, // TripsService 주입
  ) {}

  // 방 입장 처리
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = data.room;
    client.join(room);
    console.log(`Client joined room ${room}`);

    // 준비물 목록을 클라이언트에게 전송
    const preparations =
      await this.preparationsService.getPreparationsByRoom(room);
    this.server.to(room).emit('preparationList', preparations);
  }

  // 클라이언트가 특정 방에서 나가도록 하는 메서드
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { room: string }, // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket, // 연결된 소켓 정보
  ) {
    client.leave(data.room); // 소켓을 특정 방에서 나가게 함
    client.emit('leftRoom', data.room); // 방에서 성공적으로 나갔음을 클라이언트에게 알림
  }

  // 준비물 추가 처리
  @SubscribeMessage('createItem')
  async handleCreateItem(
    @MessageBody()
    createPreparationDto: CreatePreparationDto & { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { room, item } = createPreparationDto;

      // 준비물 생성
      const newPreparation = await this.preparationsService.createPreparation(
        item,
        room,
      );
      // 준비물 목록 업데이트
      const updatedPreparations =
        await this.preparationsService.getPreparationsByRoom(room);
      this.server.to(room).emit('preparationList', updatedPreparations);
    } catch (error) {
      console.log(error);
      client.emit('error', error);
    }
  }

  // 준비물 상태 변경 (준비 완료/미완료) 처리
  @SubscribeMessage('togglePreparationStatus')
  async handleTogglePreparationStatus(
    @MessageBody() data: { id: number; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { id, room } = data;

    // 준비물 상태 변경
    await this.preparationsService.togglePreparationStatus(id);

    // 업데이트된 준비물 목록 전송
    const updatedPreparations =
      await this.preparationsService.getPreparationsByRoom(room);
    this.server.to(room).emit('preparationList', updatedPreparations);
  }

  //준비물 삭제 처리
  @SubscribeMessage('deletePreparation')
  async handleDeletePreparation(
    @MessageBody() data: { id: number; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { id, room } = data;

    // 준비물 삭제
    await this.preparationsService.deletePreparation(id);

    // 업데이트된 준비물 목록 전송, 전체에게 다시 쏴줌
    const updatedPreparations =
      await this.preparationsService.getPreparationsByRoom(room);
    this.server.to(room).emit('preparationList', updatedPreparations);
  }
}
