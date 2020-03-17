import {Controller, GetMapping} from "../../backend/decorator/Controller";
import {Request, Response} from "express";
import {Inject} from "../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";

@Controller({path: '/'})
export class HomeController {

  constructor(@Inject(CalculateService) private calculateService: CalculateService) {
  }

  @GetMapping({path: '/hello'})
  public hello(req: Request, res: Response) {
    res.json({
      hello: 'world',
      add: this.calculateService.add(100, 200)
    });
  }
}
