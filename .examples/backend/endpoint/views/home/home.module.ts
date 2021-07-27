import {Module} from "@nestjs/common";
import {HomeController} from "./home.controller";
import {HomeService} from "./home.service";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
