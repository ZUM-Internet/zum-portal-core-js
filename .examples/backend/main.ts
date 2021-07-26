import { AppModule } from './app.module';
import {BaseAppContainer} from "../../backend";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";

class AppContainer extends BaseAppContainer {
  async listen (app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    await app.listen(configService.get('port'));
  }
}

new AppContainer().setup(AppModule);
