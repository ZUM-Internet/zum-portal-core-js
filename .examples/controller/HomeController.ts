import {Controller, GetMapping} from "../../backend/decorator/Controller";
import {Request, Response} from "express";
import {Inject} from "../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";
import {Middleware} from "../../backend/decorator/Middleware";
import HomeFacade from "../facade/HomeFacade";
import * as cors from 'cors';

@Controller({path: '/'})
export class HomeController {

  constructor(@Inject(CalculateService) private calculateService: CalculateService,
              @Inject(HomeFacade) private homeFacade: HomeFacade) {
  }



  @Middleware([
    (req, res, next) => {
    console.log('hello middleware');
    next()
    },
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


  /**
   * CORS 요청 가능하도록 설정하는 예제
   * 
   * 브라우저에서 아래 구문 실행시 확인 가능
   * fetch('http://localhost:8080/cors', {
   *   mode: 'cors'
   * }).then(res => res.json())
   * .then(console.log)
   * 
   * @param req
   * @param res
   */
  @Middleware(cors())
  @GetMapping({path: '/cors'})
  public async getCorsContents(req: Request, res: Response) {
    res.json({hello: 'world'})
  }


}
