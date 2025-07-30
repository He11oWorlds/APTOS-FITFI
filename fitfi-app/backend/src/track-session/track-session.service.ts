import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrackSessionDto } from './dto/create-track-session.dto';
import { sanitizeBigInts } from '../utils/sanitizeBigInts'; // 🧼 import

@Injectable()
export class TrackSessionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTrackSessionDto) {
    const session = await this.prisma.trackSession.create({
      data: {
        user_id: BigInt(dto.user_id),
        quest_id: BigInt(dto.quest_id),
        started_at: new Date(dto.started_at),
        ended_at: new Date(dto.ended_at),
        gpx_data: dto.gpx_data,
        notes: dto.notes,
        created_at: new Date(),
      },
    });

    return sanitizeBigInts(session); // 🧼 fix response
  }
}
