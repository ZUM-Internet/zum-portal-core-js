import { ConfigModule, Module, ScheduleModule, ymlConfiguration } from "@zum-portal-core/backend";
import {HomeModule} from "./endpoint/views/home/home.module";
import {AbtestModule} from "./endpoint/apis/abtest/abtest.module";
import {ContentsModule} from "./endpoint/apis/contents/contents.module";

const Config = ConfigModule.forRoot({
  load: [
    ymlConfiguration('application.yml'),
    ymlConfiguration('internalApi.yml'),
  ],
  isGlobal: true
});

const Schedule = ScheduleModule.forRoot();

const Modules = [HomeModule, AbtestModule, ContentsModule];

@Module({
  imports: [Config, Schedule, ...Modules],
})
export class AppModule {}
