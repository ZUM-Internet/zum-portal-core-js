import {Controller, GetMapping} from "../../backend/decorator/Controller";
import {Request, Response} from "express";
import {Inject} from "../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";
import {Middleware} from "../../backend/decorator/Middleware";

@Controller({path: '/'})
export class HomeController {

  constructor(@Inject(CalculateService) private calculateService: CalculateService) {
  }



  @Middleware([
    (req, res, next) => {console.log('hello!!!');next()},
  ] )
  @GetMapping({path: 'hello'})
  public hello(req: Request, res: Response) {
    console.log(req.ip)
    res.json({
      ip: req.ip,
      hello: 'world',
      add: this.calculateService.add(100, 200)
    });
  }



}
