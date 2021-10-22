import { ConfigService, NestExpressApplication, BaseAppContainer } from "@zum-portal-core/backend";
import { AppModule } from "./app.module";
import "@zum-portal-core/banner";

class AppContainer extends BaseAppContainer {
  async listen (app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    await app.listen(configService.get('port'));
  }
}

new AppContainer().setup(AppModule);