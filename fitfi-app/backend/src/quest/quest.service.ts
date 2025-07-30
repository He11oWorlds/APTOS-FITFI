import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JoinQuestDto } from './dto/join-quest.dto';
import { UpdateProgressDto } from './dto/update-progress.dto'; // ✅ Add this


@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  async joinQuest(data: JoinQuestDto) {
    const existing = await this.prisma.userQuestProfile.findFirst({
      where: {
        user_id: data.user_id,
        quest_id: data.quest_id,
      },
    });

    if (existing) {
      throw new Error('User already joined this quest.');
    }

    await this.prisma.userQuestProfile.create({
      data: {
        user_id: data.user_id,
        quest_id: data.quest_id,
        status: 'in_progress',
        progress: 0,
        started_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getAllQuests() {
    return this.prisma.quest.findMany();
  }

  async getUserQuests(user_id: number) {
    return this.prisma.userQuestProfile.findMany({
      where: { user_id },
      include: { quest: true },
    });
  }
  async updateQuestProgress(data: UpdateProgressDto) {
  const existing = await this.prisma.userQuestProfile.findFirst({
    where: {
      user_id: data.user_id,
      quest_id: data.quest_id,
    },
  });

  if (!existing) {
    throw new Error('User has not joined this quest.');
  }

  return this.prisma.userQuestProfile.update({
    where: {
      user_id_quest_id: {
        user_id: data.user_id,
        quest_id: data.quest_id,
      },
    },
    data: {
      progress: data.progress,
      updated_at: new Date(),
      status: data.progress >= 100 ? 'completed' : 'in_progress',
    },
  });
}

}
