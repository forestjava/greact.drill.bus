import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IngestController } from './controllers/ingest.controller';
import { LogController } from './controllers/log.controller';
import { LogInterceptor } from './interceptors/log.interceptor';
import { LogsService } from './services/logs.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, IngestController, LogController],
  providers: [AppService, LogController, LogInterceptor, LogsService],
})
export class AppModule { }
