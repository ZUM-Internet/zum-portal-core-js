import {Module} from "@nestjs/common";
import {ContentsService} from "./contents.service";
import {ContentsController} from "./contents.controller";
import {AdapterModule} from "../../../../../backend";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule, AdapterModule],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
