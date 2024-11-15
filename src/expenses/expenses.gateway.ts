import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { Expense } from './expenses.entity';
import { TripsService } from 'src/trips/trip.service';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/chat/chat.guard';

@WebSocketGateway({
  namespace: '/expenses', // /expenses 네임스페이스 사용
  cors: {
    origin: '*', // 모든 도메인에서의 요청을 허용
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'], // 허용할 HTTP 헤더
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
})

export class ExpensesGateway {
  @WebSocketServer() server: Server;

  constructor(
    private expensesService: ExpensesService,
    private tripsService: TripsService, // TripsService 주입
  ) {}

  //   // 소켓 연결 시 호출
  //   @UseGuards(JwtAuthGuard)
  //   handleConnection(client: Socket) {
  //     console.log(`Client connected: ${client.id}`);
  //   }

  //   // 소켓 연결 해제 시 호출
  //   handleDisconnect(client: Socket) {
  //     console.log(`Client disconnected: ${client.id}`);
  //   }

  @SubscribeMessage('filterExpensesByDay')
  async handleFilterExpensesByDay(
    @MessageBody() data: { tripId: number; day: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { tripId, day } = data;

    // day에 해당하는 경비 필터링
    const filteredExpenses = await this.expensesService.getExpensesByDay(
      tripId,
      day,
    );

    // 클라이언트에 필터링된 경비 목록 전송
    client.emit('filteredExpenses', filteredExpenses);
  }

  @SubscribeMessage('getAllExpenses')
  async handleGetAllExpenses(
    @MessageBody() data: { tripId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const expenses = await this.expensesService.getExpensesByTrip(data.tripId);
    client.emit('expenseList', expenses);
  }

  // 클라이언트가 방에 입장
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client attempting to join room ${data.room}`);
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

    client.join(tripId.toString()); // 해당 방에 소켓을 참여시킴
    client.emit('joinedRoom', tripId); // 클라이언트에게 성공 메시지
    console.log(`Client joined room ${tripId}`);

    // 방에 해당하는 경비 목록을 가져오기
    const expenses = await this.expensesService.getExpensesByTrip(tripId);
    client.emit('expenseList', expenses); // 클라이언트에 경비 목록 전송
    console.log(`Client joined room ${tripId} and received expenses`);

    // 방에 입장할 때 총합 계산
    const total = await this.expensesService.getTotalExpenseByTrip(tripId);
    client.emit('totalExpense', { tripId, total });
    const tripDate = await this.expensesService.getTripDate(data.room);
    client.emit('calculateDate', tripDate); // 숫자가 전송됨
  }

  @SubscribeMessage('createExpense')
  async handleCreateExpense(
    @MessageBody() payload: { tripId: number; expenseData: CreateExpenseDto },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('새 경비 데이터:', payload.expenseData);
    console.log('전달받은 tripId:', payload.tripId);

    if (!payload.tripId) {
      console.error('Trip ID가 전달되지 않았습니다.');
      client.emit('error', { message: 'Trip ID가 누락되었습니다.' });
      return;
    }

    // 빈 값이 있는지 확인 자바스크립트에서
    if (
      !payload.expenseData.price ||
      !payload.expenseData.category ||
      !payload.expenseData.description ||
      !payload.expenseData.day
    ) {
      console.log('빈 값이 있어서 추가 안 함.');
      return;
    }

    //서비스 - 데베에 추가 메소드 호출
    const newExpense = await this.expensesService.createExpense(
      payload.tripId,
      payload.expenseData,
    );

    const expenseWithSender = { ...newExpense, sender: client.id };

    this.server
      .to(payload.tripId.toString())
      .emit('expenseCreated', expenseWithSender);
    // 총합 계산 후 모든 클라이언트에게 총합 갱신
    const total = await this.expensesService.getTotalExpenseByTrip(
      payload.tripId,
    );
    this.server
      .to(payload.tripId.toString())
      .emit('totalExpense', { tripId: payload.tripId, total });
    console.log('경비가 성공적으로 추가되었습니다:', expenseWithSender);
  }

  @SubscribeMessage('editExpense')
  async handleEditExpense(
    @MessageBody()
    payload: {
      tripId: number;
      expenseId: number;
      expenseData: CreateExpenseDto;
    },
    @ConnectedSocket() client: Socket,
  ) {
    //서비스 - 데베에 수정 메소드 호출
    const updatedExpense = await this.expensesService.editExpense(
      payload.expenseId,
      payload.expenseData,
    );
    this.server
      .to(payload.tripId.toString())
      .emit('expenseEdited', updatedExpense);

    // 수정 후 총합 갱신
    const total = await this.expensesService.getTotalExpenseByTrip(
      payload.tripId,
    );
    this.server
      .to(payload.tripId.toString())
      .emit('totalExpense', { tripId: payload.tripId, total });
  }

  @SubscribeMessage('deleteExpense')
  async handleDeleteExpense(
    @MessageBody() data: { expenseId: number; tripId: number }, // 삭제할 경비 ID와 방 번호 (tripId)
    @ConnectedSocket() client: Socket,
  ) {
    const { expenseId, tripId } = data;

    try {
      // 서비스 - 데베에서 해당 경비가 존재하는지 확인 후 삭제
      const deletedExpense =
        await this.expensesService.deleteExpense(expenseId);

      if (deletedExpense) {
        // 해당 방의 모든 클라이언트에게 경비 삭제 알림
        this.server.to(tripId.toString()).emit('expenseDeleted', expenseId);
        // 경비 삭제 후 총합 갱신
        const total = await this.expensesService.getTotalExpenseByTrip(tripId);
        this.server
          .to(tripId.toString())
          .emit('totalExpense', { tripId, total });
        console.log(`Expense with ID ${expenseId} deleted in room ${tripId}`);
      } else {
        client.emit('error', {
          message: 'Expense not found or already deleted.',
        });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      client.emit('error', { message: 'Failed to delete expense.' });
    }
  }

  //경비 총합 반환
  @SubscribeMessage('getTotalExpense')
  async handleGetTotalExpense(
    @MessageBody() data: { tripId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const total = await this.expensesService.getTotalExpenseByTrip(data.tripId);
    client.emit('totalExpense', { tripId: data.tripId, total });
  }
}
