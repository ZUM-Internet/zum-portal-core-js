import {Controller, GetMapping} from "../../../backend/decorator/Controller";
import {Request, Response} from "express";
import {Middleware} from "../../../backend/decorator/Middleware";
import {Inject} from "../../../backend/decorator/Alias";
import TestInjectableMiddleware from "../middleware/TestInjectableMiddleware";

@Controller({path: '/'})
export class ABTestController {

  constructor(
    @Inject(TestInjectableMiddleware)
    private testInjectableMiddleware: TestInjectableMiddleware
  ) {}

  // @ts-ignore
  @Middleware(() => this.testInjectableMiddleware.setup)
  @GetMapping({path: '/api/abtest'})
  public abtest(req: Request, res: Response) {
    res.json({
      cookies: res.getHeader('set-cookie')
    });
  }



}
