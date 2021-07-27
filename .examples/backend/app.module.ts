import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ymlConfiguration} from "../../backend";

import {HomeModule} from "./endpoint/views/home/home.module";

const Config = ConfigModule.forRoot({
  load: [ymlConfiguration('application.yml')],
  isGlobal: true
});

const Modules = [HomeModule];

@Module({
  imports: [Config, ...Modules],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
