import { AdapterModule, Module, ConfigModule } from "@zum-front-core/backend";
import { ContentsService } from "./contents.service";
import { ContentsController } from "./contents.controller";

@Module({
  imports: [ConfigModule, AdapterModule],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {
}
