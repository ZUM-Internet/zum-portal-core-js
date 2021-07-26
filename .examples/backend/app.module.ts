import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ymlConfiguration} from "../../backend";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ymlConfiguration('application.yml')]
    })
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
