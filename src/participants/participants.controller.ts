import { Body, Controller, Post, Param } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParticipantsDto } from './dto/create-participant.dto';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post(':trip_id/invite')
  @ApiOperation({ summary: 'Invite members to a trip' })
  async inviteMembers(
    @Param('trip_id') tripId: number,
    @Body() createParticipantsDto: CreateParticipantsDto,
  ): Promise<{ message: string }> {
    await this.participantsService.addParticipantsToTrip(
      tripId,
      createParticipantsDto,
    );
    return { message: 'Members invited successfully' };
  }
}
