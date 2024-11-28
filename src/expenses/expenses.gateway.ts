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

  // @SubscribeMessage('createExpense')
  // async handleCreateExpense(
  //   @MessageBody() payload: { tripId: number; expenseData: CreateExpenseDto },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log('새 경비 데이터:', payload.expenseData);
  //   console.log('전달받은 tripId:', payload.tripId);

  //   if (!payload.tripId) {
  //     console.error('Trip ID가 전달되지 않았습니다.');
  //     client.emit('error', { message: 'Trip ID가 누락되었습니다.' });
  //     return;
  //   }

  //   // 빈 값이 있는지 확인 자바스크립트에서
  //   if (
  //     !payload.expenseData.price ||
  //     !payload.expenseData.category ||
  //     !payload.expenseData.description ||
  //     !payload.expenseData.day
  //   ) {
  //     console.log('빈 값이 있어서 추가 안 함.');
  //     return;
  //   }

  //   //서비스 - 데베에 추가 메소드 호출
  //   const newExpense = await this.expensesService.createExpense(
  //     payload.tripId,
  //     payload.expenseData,
  //   ); //추가된 경비 하나 반환함.

  //   this.server
  //     .to(payload.tripId.toString())
  //     .emit('expenseCreated', newExpense);

  //   // 총합 계산 후 모든 클라이언트에게 총합 갱신
  //   const total = await this.expensesService.getTotalExpenseByTrip(
  //     payload.tripId,
  //   );
  //   this.server
  //     .to(payload.tripId.toString())
  //     .emit('totalExpense', { tripId: payload.tripId, total });
  // }

  @SubscribeMessage('createExpense')
  async handleCreateExpense(
    @MessageBody() payload: { tripId: number; expenseData: CreateExpenseDto },
    @ConnectedSocket() client: Socket,
  ) {
    if (!payload.tripId) {
      console.error('Trip ID가 전달되지 않았습니다.');
      client.emit('error', { message: 'Trip ID가 누락되었습니다.' });
      return;
    }
    // 입력 데이터 검증
    if (
      !payload.expenseData.price ||
      !payload.expenseData.category ||
      !payload.expenseData.description ||
      !payload.expenseData.day
    ) {
      console.log('빈 값이 있어서 추가 안 함.');
      return;
    }
    // 경비 생성
    const newExpense = await this.expensesService.createExpense(
      payload.tripId,
      payload.expenseData,
    );

    // 새 경비 생성 후, 해당 day의 모든 경비 가져오기
    const updatedExpenses = await this.expensesService.getExpensesByDay(
      payload.tripId,
      payload.expenseData.day,
    );

    // 클라이언트에게 반환할 데이터 생성
    const response = {
      newExpense, // 새로 추가된 경비
      updatedExpenses, // 해당 day의 전체 경비 목록
    };

    // 클라이언트에 응답 전송
    client.emit('expenseCreated', response);
    // 클라이언트에 응답 전송을 모든 클라이언트로 변경
    this.server.to(payload.tripId.toString()).emit('expenseCreated', response);
  }

  // @SubscribeMessage('editExpense')
  // async handleEditExpense(
  //   @MessageBody()
  //   payload: {
  //     tripId: number;
  //     expenseId: number;
  //     expenseData: CreateExpenseDto;
  //   },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   try {
  //     // 경비 수정
  //     await this.expensesService.editExpense(
  //       payload.expenseId,
  //       payload.expenseData,
  //     );

  //     // payload.expenseData.day가 null이면 전체 경비, 그렇지 않으면 해당 day의 경비 조회
  //     const updatedExpenses = payload.expenseData.day
  //       ? await this.expensesService.getExpensesByDay(
  //           payload.tripId,
  //           payload.expenseData.day,
  //         )
  //       : await this.expensesService.getExpensesByTrip(payload.tripId);

  //     // 모든 클라이언트에 업데이트된 경비 목록 전송
  //     client.emit('expenseList', updatedExpenses);
  //     this.server
  //       .to(payload.tripId.toString())
  //       .emit('expenseList', updatedExpenses);
  //   } catch (error) {
  //     console.error('Error editing expense:', error);
  //     client.emit('error', { message: 'Failed to edit expense.' });
  //   }
  // }

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
    try {
      // 경비 수정
      await this.expensesService.editExpense(
        payload.expenseId,
        payload.expenseData,
      );

      // 수정된 경비 목록 가져오기
      const updatedExpenses = payload.expenseData.day
        ? await this.expensesService.getExpensesByDay(
            payload.tripId,
            payload.expenseData.day,
          )
        : await this.expensesService.getExpensesByTrip(payload.tripId);

      // 해당 tripId에 연결된 소켓 중에서 같은 일차(day)를 보고 있는 소켓에게만 이벤트 전송
      this.server.sockets.sockets.forEach((connectedSocket) => {
        if (
          connectedSocket.data.tripId === payload.tripId &&
          connectedSocket.data.currentDay === payload.expenseData.day
        ) {
          connectedSocket.emit('expenseList', updatedExpenses);
        }
      });
    } catch (error) {
      console.error('Error editing expense:', error);
      client.emit('error', { message: 'Failed to edit expense.' });
    }
  }

  @SubscribeMessage('deleteExpense')
  async handleDeleteExpense(
    @MessageBody()
    data: { expenseId: number; tripId: number; day: number | null },
    @ConnectedSocket() client: Socket,
  ) {
    const { expenseId, tripId, day } = data;

    try {
      // 경비 삭제
      const deletedExpense =
        await this.expensesService.deleteExpense(expenseId);

      if (deletedExpense) {
        // day가 null이면 전체 경비, 그렇지 않으면 해당 day 경비 조회
        const updatedExpenses = day
          ? await this.expensesService.getExpensesByDay(tripId, day)
          : await this.expensesService.getExpensesByTrip(tripId);

        // 모든 클라이언트에 업데이트된 경비 목록 전송
        client.emit('expenseList', updatedExpenses);
        this.server.to(tripId.toString()).emit('expenseList', updatedExpenses);
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

  @SubscribeMessage('updateCurrentDay')
  handleUpdateCurrentDay(
    @MessageBody() data: { tripId: number; currentDay: number | null },
    @ConnectedSocket() client: Socket,
  ) {
    const { tripId, currentDay } = data;

    // 클라이언트의 현재 일차를 socket 객체에 저장
    client.data.currentDay = currentDay;
    client.data.tripId = tripId;

    console.log(
      `Client ${client.id} updated currentDay to ${currentDay} in trip ${tripId}`,
    );
  }
}
