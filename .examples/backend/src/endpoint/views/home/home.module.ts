import { CacheModule, Module, ConfigModule } from "@zum-front-core/backend";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [ConfigModule, CacheModule.register()],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {
}
