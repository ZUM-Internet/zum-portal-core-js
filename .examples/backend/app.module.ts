import {CacheModule, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ymlConfiguration} from "../../backend";

import {HomeModule} from "./endpoint/views/home/home.module";
import {AbtestModule} from "./endpoint/apis/abtest/abtest.module";
import {ScheduleModule} from "@nestjs/schedule";

const Config = ConfigModule.forRoot({
  load: [ymlConfiguration('application.yml')],
  isGlobal: true
});

const Schedule = ScheduleModule.forRoot();

const Modules = [HomeModule, AbtestModule];

@Module({
  imports: [Config, Schedule, ...Modules],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
