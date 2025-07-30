import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // ✅ this line
import { PrismaModule } from '../prisma/prisma.module';
import { TrackSessionModule } from './track-session/track-session.module';
import { MapTrackModule } from './map-track/map-track.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ add this
    AuthModule,
    PrismaModule,
    TrackSessionModule,
    MapTrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

