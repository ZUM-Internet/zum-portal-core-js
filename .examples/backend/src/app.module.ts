import {
  ConfigModule,
  Module,
  ymlConfiguration,
  ZumCacheModule
} from "@zum-portal-core/backend";
import { HomeModule } from "./endpoint/views/home/home.module";
import { AbtestModule } from "./endpoint/apis/abtest/abtest.module";
import { ContentsModule } from "./endpoint/apis/contents/contents.module";

const Config = ConfigModule.forRoot({
  load: [
    ymlConfiguration('application.yml'),
    ymlConfiguration('internalApi.yml'),
  ],
  isGlobal: true
});

const Modules = [ContentsModule, AbtestModule, HomeModule];

@Module({
  imports: [Config, ZumCacheModule.forRoot(), ...Modules],
})
export class AppModule {
}
