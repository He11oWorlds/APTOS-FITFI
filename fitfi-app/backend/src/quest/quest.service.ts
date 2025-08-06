// src/quest/quest.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JoinQuestDto } from './dto/join-quest.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  // === DAILY QUEST SYSTEM ===
  async getTodayQuests() {
    try {
      const start = new Date();
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date();
      end.setUTCHours(23, 59, 59, 999);

      let dailyQuests = await this.prisma.quest.findMany({
        where: {
          claimed_at: {
            gte: start,
            lte: end,
          },
          is_daily: true, // ✅ FIXED HERE
        },
      });

      if (dailyQuests.length === 0) {
        dailyQuests = await this.generateNewDailyQuests();
      }

      return dailyQuests;
    } catch (err) {
      console.error('[QuestService] getTodayQuests error:', err);
      throw new Error('Failed to fetch today\'s quests');
    }
  }

  async generateNewDailyQuests() {
    const templates = [
      { type: 'steps', unit: 'steps', min: 3000, max: 10000 },
      { type: 'distance', unit: 'km', min: 2, max: 8 },
      { type: 'duration', unit: 'minutes', min: 10, max: 60 },
      { type: 'calories', unit: 'kcal', min: 50, max: 300 },
    ];

    const generated: Awaited<ReturnType<typeof this.prisma.quest.create>>[] = [];

    for (const t of templates) {
      const goal = this.randomRange(t.min, t.max);

      const quest = await this.prisma.quest.create({
        data: {
          title: `Complete ${goal} ${t.unit}`,
          description: `Achieve ${goal} ${t.unit} today.`,
          type: t.type,
          goal: goal,
          unit: t.unit,
          is_daily: true, // ✅ Consistent
          reward_type: 'daily',
          points: this.randomRange(5, 15),
          completed: false,
          claimed_at: new Date(),
          difficulty: this.assignDifficulty(goal, t.type),
          target_steps: t.type === 'steps' ? goal : 0,
        },
      });

      generated.push(quest);
    }

    return generated;
  }

  private assignDifficulty(value: number, type: string): string {
    switch (type) {
      case 'steps':
        return value > 8000 ? 'hard' : value > 5000 ? 'medium' : 'easy';
      case 'distance':
        return value > 6 ? 'hard' : value > 4 ? 'medium' : 'easy';
      case 'duration':
        return value > 45 ? 'hard' : value > 25 ? 'medium' : 'easy';
      case 'calories':
        return value > 200 ? 'hard' : value > 100 ? 'medium' : 'easy';
      default:
        return 'medium';
    }
  }

  private randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // === ORIGINAL QUEST LOGIC ===

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
