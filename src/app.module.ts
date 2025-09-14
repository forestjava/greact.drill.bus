import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IngestController } from './controllers/ingest.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, IngestController],
  providers: [AppService],
})
export class AppModule { }
