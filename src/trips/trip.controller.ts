import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trip.service';
import { Trip } from './trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Member } from 'src/member/entities/member.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { only } from 'node:test';
// import { User } from 'src/auth/user.entity';
// import { GetUser } from '../auth/get-user.decorator';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('trips')
@ApiBearerAuth('access-token') // Bearer 토큰 사용 명시
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create a new trip',
    description: '새로운 여행을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'The trip has been successfully created.',
  })
  async createTrip(
    @Body() createTripDto: CreateTripDto,
    @GetUser() member: Member,
  ): Promise<{
    data: { trip: Partial<Trip>; trip_id: number };
    status: number;
    message: string;
  }> {
    // const trip = await this.tripsService.createTrip(createTripDto, member);

    const { onlyTripData, trip_id } = await this.tripsService.createTrip(
      createTripDto,
      member,
    );
    console.log('member:', member);
    return {
      data: {
        trip: onlyTripData,
        trip_id: trip_id,
      },
      status: 201,
      message: 'Trip created successfully',
    };
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // @ApiOperation({
  //   summary: 'Get all trips',
  //   description: '모든 여행을 가져옵니다.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Get all trips',
  //   schema: {
  //     example: {
  //       trips: [
  //         {
  //           id: 'n',
  //           name: 'Trip',
  //           location: 'Location',
  //           start_date: 'yyyy-mm-dd',
  //           end_date: 'yyyy-mm-dd',
  //           // is_deleted: 'false',
  //           // create_at: 'yyyy-mm-dd',
  //           // update_at: 'yyyy-mm-dd',
  //         },
  //       ],
  //     },
  //   },
  // })
  // async getAllTrips(@GetUser() member: Member) {
  //   // 내가 생성한 여행만 가져옴
  //   const trips = await this.tripsService.getAllTrips(member);
  //   return { trips, status: 200, message: 'Trips fetched successfully' };
  // }

  @Get('checkpersonaltrips') //내 여행 중에서 1명만 있는 것, 개인 일정
  @UseGuards(AuthGuard)
  async getPersonalTrips(@GetUser() member: Member) {
    const trips = await this.tripsService.getPersonalTrips(member);
    return { trips };
  }

  @Get('checkgrouptrips') //단체 일정 조회하기
  @UseGuards(AuthGuard)
  async getGroupTrips(@GetUser() member: Member) {
    const trips = await this.tripsService.getGroupTrips(member);
    return { trips };
  }

  @Get('checkmytrips') // 내가 참여한 모든 여행 가져오기
  @UseGuards(AuthGuard)
  async getTripsForParticipant(@GetUser() member: Member) {
    const trips = await this.tripsService.getTripsForParticipant(member);
    return { trips };
  }

  @Put(':trip_id')
  @ApiOperation({
    summary: 'Update a trip',
    description: '여행을 수정합니다.',
  })
  async updateTrip(
    @Param('trip_id') tripId: number,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<{ data: Trip; status: number; message: string }> {
    const trip = await this.tripsService.updateTrip(tripId, updateTripDto);

    return {
      data: trip,
      status: 200,
      message: 'Trip updated successfully',
    };
  }

  @Delete(':trip_id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a trip',
    description: '여행을 삭제합니다.',
  })
  async deleteTrip(
    @Param('trip_id') tripId: number,
    @GetUser() member: Member,
  ): Promise<{ data: { id: number }; status: number; message: string }> {
    await this.tripsService.deleteTrip(tripId, member); // trip 삭제 처리

    return {
      data: { id: tripId }, // 삭제된 여행의 ID 반환
      status: 200, // 성공 상태 코드
      message: 'Trip deleted successfully', // 성공 메시지
    };
  }
}
