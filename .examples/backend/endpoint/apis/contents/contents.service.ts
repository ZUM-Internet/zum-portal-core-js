import {Injectable} from "@nestjs/common";
import {ZumProvisionAdapter} from "../../../../../backend";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ContentsService {
  private readonly APP_API_PATH;

  constructor(
    private readonly adapter: ZumProvisionAdapter,
    private readonly configService: ConfigService,
  ) {
    this.APP_API_PATH = configService.get('app-api');
  }

  public async getContents () {
    const { base, ['chrome-extension-contents']: chromeExtensionContents } = this.APP_API_PATH;
    const { data } = await this.adapter.get({
      url: base + chromeExtensionContents
    });
    return data;
  }
}