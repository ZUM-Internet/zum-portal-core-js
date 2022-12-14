import { ConfigService, NestExpressApplication, BaseAppContainer } from '@zum-front-end/backend';
import { AppModule } from './app.module';
import * as path from 'path';
import '@zum-front-end/banner';

class AppContainer extends BaseAppContainer {
  async listen(app: NestExpressApplication) {
    const configService = app.get(ConfigService);
    await app.listen(configService.get('port'));
  }
}

const options = {
  resourcePath: path.join(__dirname, '../../resources'),
};

new AppContainer().setup(AppModule, options);
