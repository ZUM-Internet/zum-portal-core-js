import { CacheModule, Module, ConfigModule } from "@zum-front-end/backend";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [ConfigModule, CacheModule.register()],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {
}
