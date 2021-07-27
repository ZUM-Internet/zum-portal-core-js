import {Controller, Get, Inject} from '@nestjs/common';
import {HomeService} from "./home.service";

@Controller()
export class HomeController {

  constructor(
    private readonly homeService: HomeService
  ) {}

  @Get()
  getHome(): Promise<string> {
    return this.homeService.ssrHTML;
  }

}
