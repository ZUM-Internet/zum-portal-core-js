import {Controller, Get, Res} from "@zum-front-core/backend";
import {Response} from "express";

@Controller()
export class AbtestController {
  constructor() {}

  @Get('/api/abtest')
  public abtest(@Res() res: Response) {
    res.json({
      cookies: res.getHeader('set-cookie')
    });
  }
}