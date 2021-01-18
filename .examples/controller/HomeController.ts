import {Controller, GetMapping} from "../../backend/decorator/Controller";
import {Request, Response} from "express";
import {Inject} from "../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";
import {Middleware} from "../../backend/decorator/Middleware";
import HomeFacade from "../facade/HomeFacade";

@Controller({path: '/'})
export class HomeController {

  constructor(@Inject(CalculateService) private calculateService: CalculateService,
              @Inject(HomeFacade) private homeFacade: HomeFacade) {
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


  @GetMapping({path: '/bundle'})
  public async getRenderedHtml(req: Request, res: Response) {
    res.send(await this.homeFacade.getRenderedHtml())
  }


}
