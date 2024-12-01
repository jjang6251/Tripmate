// import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AuthenticatedSocket } from 'src/chat/interface/custom-socket.interface';
// import { TripsService } from 'src/trips/trip.service';
// import { DetailTripService } from './detail-trip.service';
// import { CreateDetailTripDto } from './dto/createDetailTrip.dto';

// @WebSocketGateway(
//   {
//     namespace: '/detailTrip',
//     cors: {
//       origin: '*', // 모든 도메인에서의 요청을 허용
//       methods: ['GET', 'POST'], // 허용할 HTTP 메서드
//       allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
//       credentials: true // 쿠키를 포함한 요청을 허용
//     }

//   }
// )
// export class DetailTripGateway {

//   constructor(
//     private tripsService: TripsService, // TripsService 주입
//     private detailTripService: DetailTripService
//   ) { }

//   @WebSocketServer() server: Server;

//   handleConnection(client: AuthenticatedSocket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: AuthenticatedSocket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('joinRoom')
//   async handleJoinRoom(
//     @MessageBody() data: { room: number },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     console.log(`Welcome to ${data.room}`);

//     const tripId = data.room
//     // tripId가 유효한지 확인
//     const tripExists = await this.tripsService.checkIfTripExists(tripId);

//     //없는 여행일 때 에러 메시지 전송
//     if (!tripExists) {
//       console.error(`Trip with ID ${tripId} does not exist.`);
//       client.emit('roomError', {
//         message: `Trip with ID ${tripId} does not exist.`,
//       });
//       return;
//     }

//     client.join(tripId.toString()); // 소켓을 특정 방에 참여시킴
//     client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림

//     const detailTrip = await this.detailTripService.getDetailTrip(data.room, 1); //처음 랜더링시 1일차로 고정
//     client.emit("detailTripList", detailTrip);
//   }

//   @SubscribeMessage('getDetailTripList')
//   async getDetailTripList(
//     @MessageBody() data: { room: number, day: number },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     const detailTrip = await this.detailTripService.getDetailTrip(data.room, data.day);
//     client.emit("detailTripList", detailTrip);
//   }

//   //상세 여행 생성
//   @SubscribeMessage('createDetailTrip')
//   async createDetailTrip(
//     @MessageBody() data: { createDetailTrip: CreateDetailTripDto },  // 메시지 바디에서 room 정보를 받음
//     @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
//   ) {
//     const newData = await this.detailTripService.createDetailTrip(data.createDetailTrip);
//     const existData = await this.detailTripService.getDetailTrip(data.createDetailTrip.tripId, data.createDetailTrip.day);

//     client.emit('detailTripCreated', existData);
//     this.server.to(data.createDetailTrip.tripId.toString()).emit('detailTripCreated', existData);
//   }

//   //상세 여행 순서 바꿈
//   @SubscribeMessage('updateOrder')
//   async updateOrder(
//     @MessageBody() data: { tripId: number, updatedList: { id: number, order: number }[], day: number },
//     @ConnectedSocket() client: Socket
//   ) {

//     const { tripId, updatedList, day } = data;

//     for (const item of updatedList) {
//       await this.detailTripService.updateOrder(item.id, item.order);
//     }

//     const updatedTripList = await this.detailTripService.getDetailTrip(tripId, day);

//     client.emit('orderUpdated', updatedTripList);
//     this.server.to(tripId.toString()).emit('orderUpdated', updatedTripList);
//   }

//   @SubscribeMessage('updateTrip')
//   async updateTrip(
//     @MessageBody() data: {id: number, updateDetailTrip: CreateDetailTripDto},
//     @ConnectedSocket() client: Socket
//   ) {
//     const {id, updateDetailTrip} = data;
//     await this.detailTripService.updateTrip(id, updateDetailTrip);

//     const updatedTripList = await this.detailTripService.getDetailTrip(updateDetailTrip.tripId, updateDetailTrip.day);

//     client.emit('detailTripUpdated', updatedTripList);
//     this.server.to(updateDetailTrip.tripId.toString()).emit('detailTripUpdated', updatedTripList);

//   }

//   @SubscribeMessage('deleteDetailTrip')
//   async deleteDetailTrip(
//     @MessageBody() data: { id: number, tripId: number, day: number },
//     @ConnectedSocket() client: Socket
//   ) {
//     const {id, tripId, day} = data;

//     await this.detailTripService.deleteDetailTrip(id);

//     const updatedTripList = await this.detailTripService.getDetailTrip(tripId, day);

//     client.emit('deleteUpdated', updatedTripList);
//     this.server.to(tripId.toString()).emit('deleteUpdated', updatedTripList);
//   }
// }

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from 'src/chat/interface/custom-socket.interface';
import { TripsService } from 'src/trips/trip.service';
import { DetailTripService } from './detail-trip.service';
import { CreateDetailTripDto } from './dto/createDetailTrip.dto';

@WebSocketGateway({
  namespace: '/detailTrip',
  cors: {
    origin: '*', // 모든 도메인에서의 요청을 허용
    methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
})
export class DetailTripGateway {
  constructor(
    private tripsService: TripsService, // TripsService 주입
    private detailTripService: DetailTripService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: AuthenticatedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: number }, // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket, // 연결된 소켓 정보
  ) {
    console.log(`Welcome to ${data.room}`);

    const tripId = data.room;
    // tripId가 유효한지 확인
    const tripExists = await this.tripsService.checkIfTripExists(tripId);

    //없는 여행일 때 에러 메시지 전송
    if (!tripExists) {
      console.error(`Trip with ID ${tripId} does not exist.`);
      client.emit('roomError', {
        message: `Trip with ID ${tripId} does not exist.`,
      });
      return;
    }

    client.join(tripId.toString()); // 소켓을 특정 방에 참여시킴
    client.emit('joinedRoom', data.room); // 방에 성공적으로 참여했음을 클라이언트에게 알림

    const detailTrip = await this.detailTripService.getDetailTrip(data.room, 1); //처음 랜더링시 1일차로 고정
    client.emit('detailTripList', detailTrip);
  }

  @SubscribeMessage('getDetailTripList')
  async getDetailTripList(
    @MessageBody() data: { room: number; day: number }, // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket, // 연결된 소켓 정보
  ) {
    const detailTrip = await this.detailTripService.getDetailTrip(
      data.room,
      data.day,
    );
    client.emit('detailTripList', detailTrip);
  }

  //상세 여행 생성
  @SubscribeMessage('createDetailTrip')
  async createDetailTrip(
    @MessageBody() data: { createDetailTrip: CreateDetailTripDto },  // 메시지 바디에서 room 정보를 받음
    @ConnectedSocket() client: Socket,      // 연결된 소켓 정보
  ) {
    const newData = await this.detailTripService.createDetailTrip(data.createDetailTrip);
    const existData = await this.detailTripService.getDetailTrip(data.createDetailTrip.tripId, data.createDetailTrip.day);

    client.emit('detailTripCreated', existData);
    this.server.to(data.createDetailTrip.tripId.toString()).emit('detailTripCreated', existData);
  }

  //상세 여행 순서 바꿈
  @SubscribeMessage('updateOrder')
  async updateOrder(
    @MessageBody()
    data: {
      tripId: number;
      updatedList: { id: number; order: number }[];
      day: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { tripId, updatedList, day } = data;

    for (const item of updatedList) {
      await this.detailTripService.updateOrder(item.id, item.order);
    }

    const updatedTripList = await this.detailTripService.getDetailTrip(
      tripId,
      day,
    );

    client.emit('orderUpdated', updatedTripList);
    this.server.to(tripId.toString()).emit('orderUpdated', updatedTripList);
  }

  @SubscribeMessage('updateTrip')
  async updateTrip(
    @MessageBody() data: { id: number; updateDetailTrip: CreateDetailTripDto },
    @ConnectedSocket() client: Socket,
  ) {
    const { id, updateDetailTrip } = data;
    await this.detailTripService.updateTrip(id, updateDetailTrip);

    const updatedTripList = await this.detailTripService.getDetailTrip(
      updateDetailTrip.tripId,
      updateDetailTrip.day,
    );

    client.emit('detailTripUpdated', updatedTripList);
    this.server
      .to(updateDetailTrip.tripId.toString())
      .emit('detailTripUpdated', updatedTripList);
  }

  @SubscribeMessage('deleteDetailTrip')
  async deleteDetailTrip(
    @MessageBody() data: { id: number; tripId: number; day: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { id, tripId, day } = data;

    await this.detailTripService.deleteDetailTrip(id);

    const updatedTripList = await this.detailTripService.getDetailTrip(
      tripId,
      day,
    );

    client.emit('deleteUpdated', updatedTripList);
    this.server.to(tripId.toString()).emit('deleteUpdated', updatedTripList);
  }
}
