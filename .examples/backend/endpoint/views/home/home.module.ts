import {CacheModule, Module} from "@nestjs/common";
import {HomeController} from "./home.controller";
import {HomeService} from "./home.service";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule, CacheModule.register()],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
