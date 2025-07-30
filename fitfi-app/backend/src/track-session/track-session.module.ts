import { Module } from '@nestjs/common';
import { TrackSessionService } from './track-session.service';
import { TrackSessionController } from './track-session.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // ✅ Add this

@Module({
  imports: [PrismaModule], // ✅ Import her
  providers: [TrackSessionService],
  controllers: [TrackSessionController]
})
export class TrackSessionModule {}
