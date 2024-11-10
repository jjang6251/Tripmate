import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Get,
  Query,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParticipantsDto } from './dto/create-participant.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Member } from 'src/member/entities/member.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}


















  // 여행 강퇴
  @Delete(':trip_id/expel')
  @UseGuards(AuthGuard)
  async expelParticipants(
    @GetUser() expeller: Member, //추방 시키는 사람
    @Param('trip_id') tripId: number, //여행
    @Query('expelledname') expelledname: string, //추방 당할 사람
  ): Promise<void> {
    if (!expelledname) {
      throw new NotFoundException('강퇴할 닉네임을 입력해주세요.');
    }
    await this.participantsService.expelParticipants(
      expeller,
      tripId,
      expelledname,
    );
  }

  //본인이 여행 참여자 목록에서 나가기
  @Delete(':trip_id/escape')
  @UseGuards(AuthGuard)
  async deleteParticipants(
    @GetUser() escaper: Member,
    @Param('trip_id') tripId: number,
  ): Promise<void> {
    await this.participantsService.deleteParticipants(escaper, tripId);
  }

  // Member DB에서 친구 검색
  @Get('searchparticipant')
  // @UseGuards(AuthGuard) //없어도 될 듯...
  async findParticipant(
    @Query('searchedname') searchedname: string,
  ): Promise<Partial<Member>> {
    if (!searchedname) {
      //입력 안 하면
      throw new NotFoundException('닉네임을 입력해주세요.');
    }
    return await this.participantsService.findParticipantsInMember(
      searchedname,
    );
  }

  // 여행 참여자 초대
  @Post(':trip_id/invite')
  @UseGuards(AuthGuard)
  async inviteMembers(
    @Param('trip_id') tripId: number,
    @Body() createParticipantsDto: CreateParticipantsDto,
    @GetUser() inviter: Member,
  ): Promise<Array<String>> {
    // 초대할 각 닉네임에 대해 멤버를 확인
    const foundMembers = [];
    for (const searchedname of createParticipantsDto.memberIds) {
      foundMembers.push(searchedname); // 멤버가 확인되면 초대할 목록에 추가
    }
    // 초대할 멤버가 없으면 예외 처리
    if (foundMembers.length === 0) {
      throw new NotFoundException('초대할 회원이 존재하지 않습니다.');
    }
    // 초대 메소드 실행
    await this.participantsService.addParticipantsToTrip(
      tripId,
      foundMembers,
      inviter,
    );
    return foundMembers;
  }
}
