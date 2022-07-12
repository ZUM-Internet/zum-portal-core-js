import {Controller, Get} from "@zum-front-end/backend";
import {ContentsService} from "./contents.service";

@Controller()
export class ContentsController {

  constructor(
    private readonly contentsService: ContentsService
  ) {}

  @Get('/api/contents')
  public getContents() {
    return this.contentsService.getContents();
  }

}
