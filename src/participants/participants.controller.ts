import { Body, Controller, Post, Param, UseGuards, Get, Query, NotFoundException } from '@nestjs/common';
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

  @Get('searchparticipant')
  @UseGuards(AuthGuard)
  async findParticipant(@Query('searchedname') searchedname: string): Promise<Partial<Member>> {
    if (!searchedname) {//입력 안 하면
      throw new NotFoundException('닉네임을 입력해주세요.');
    }
    return await this.participantsService.findParticipantsInMember(searchedname);
  }


  @Post(':trip_id/invite')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Invite members to a trip' })
  async inviteMembers(
    @Param('trip_id') tripId: number,
    @Body() createParticipantsDto: CreateParticipantsDto,
    @GetUser() member: Member,
  ): Promise<{ message: string }> {
    await this.participantsService.addParticipantsToTrip(
      tripId,
      createParticipantsDto,
      member,
    );
    return { message: 'Members invited successfully' };
  }









  
}
