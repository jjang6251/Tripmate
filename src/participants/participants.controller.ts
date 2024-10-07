import { Body, Controller, Post, Param } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParticipantsDto } from './dto/create-participant.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Member } from 'src/member/entities/member.entity';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post(':trip_id/invite')
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
