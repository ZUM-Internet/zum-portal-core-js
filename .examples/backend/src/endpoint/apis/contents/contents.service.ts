import {
  ConfigService,
  Injectable,
  ZumCache,
  ZumProvisionAdapter,
  CronExpression,
} from '@zum-front-end/backend';

@Injectable()
export class ContentsService {
  private readonly APP_API_PATH;

  constructor(private readonly adapter: ZumProvisionAdapter, private readonly configService: ConfigService) {
    this.APP_API_PATH = configService.get('app-api');
  }

  @ZumCache({ cron: CronExpression.EVERY_30_SECONDS, logger: console.log })
  public async getContents() {
    const { base, ['chrome-extension-contents']: chromeExtensionContents } = this.APP_API_PATH;
    const { data } = await this.adapter.get({
      url: base + chromeExtensionContents,
    });

    return data;
  }
}
