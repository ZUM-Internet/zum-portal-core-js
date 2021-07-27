import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AbtestController} from "./abtest.controller";
import {setupVariants} from "../../../middleware/setup.variatns";

@Module({
  controllers: [AbtestController],
})
export class AbtestModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(setupVariants)
      .forRoutes(AbtestController)
  }
}
