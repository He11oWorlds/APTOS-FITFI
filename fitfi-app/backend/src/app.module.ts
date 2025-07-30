import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TrackSessionModule } from './track-session/track-session.module';
import { MapTrackModule } from './map-track/map-track.module';
import { ConfigModule } from '@nestjs/config';
import { QuestModule } from './quest/quest.module'; // ✅ added this line

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    TrackSessionModule,
    MapTrackModule,
    QuestModule, // ✅ added this line
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
