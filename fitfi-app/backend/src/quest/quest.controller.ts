import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestService } from './quest.service';
import { JoinQuestDto } from './dto/join-quest.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller('quests')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  getAllQuests() {
    return this.questService.getAllQuests();
  }
  @Get('daily')
getDailyQuests() {
  return this.questService.getTodayQuests();
}

  @Get('user/:user_id')
  getUserQuests(@Param('user_id') user_id: string) {
    return this.questService.getUserQuests(Number(user_id));
  }

  @Post('join')
  joinQuest(@Body() dto: JoinQuestDto) {
    return this.questService.joinQuest(dto);
  }

  @Post('progress')
  updateQuestProgress(@Body() dto: UpdateProgressDto) {
    return this.questService.updateQuestProgress(dto);
  }
}
