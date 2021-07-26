import { AppModule } from './app.module';
import {BaseAppContainer} from "../../backend";
import {NestExpressApplication} from "@nestjs/platform-express";

class AppContainer extends BaseAppContainer {
  async listen (app: NestExpressApplication) {
    await app.listen(8080);
  }
}

new AppContainer().setup(AppModule);
