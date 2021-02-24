import {Controller, GetMapping} from "../../backend/decorator/Controller";
import {Application, Request, Response} from "express";
import {Inject} from "../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";
import {Middleware} from "../../backend/decorator/Middleware";
import HomeFacade from "../facade/HomeFacade";
import * as cors from 'cors';
import CustomDecoratorService from "../service/CustomDecoratorService";
import TestInjectableMiddleware from "../middleware/TestInjectableMiddleware";

@Controller({path: '/'})
export class HomeController {

  constructor(@Inject(CalculateService) private calculateService: CalculateService,
              @Inject(HomeFacade) private homeFacade: HomeFacade,
              @Inject(CustomDecoratorService) private customDecorator: CustomDecoratorService,
              @Inject(TestInjectableMiddleware) private testInjectableMiddleware: TestInjectableMiddleware) {



  }

  // @ts-ignore
  @Middleware(() => this.testInjectableMiddleware.setup)
  @GetMapping({path: '/ab'})
  public abtest(req: Request, res: Response) {
    // console.log(res.locals)
    res.send('f');
  }


/*
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


  /!**
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
   *!/
  @Middleware(cors())
  @GetMapping({path: '/cors'})
  public async getCorsContents(req: Request, res: Response) {
    res.json({hello: 'world'})
  }



  @GetMapping({path: '/custom'})
  public async customDecoratorTest(req: Request, res: Response) {

    res.json({
      before1: await this.customDecorator.beforeReplace('12345'),
      before2_1: await this.customDecorator.beforeOddStop(1),
      before2_2: await this.customDecorator.beforeOddStop(2),
      before2_3: await this.customDecorator.beforeOddStop(3),

      after1_1: await this.customDecorator.afterReplace(1),
      after1_2: await this.customDecorator.afterReplace(2),

      after2_1: await this.customDecorator.afterOddStop(1),
      after2_2: await this.customDecorator.afterOddStop(2),

    });
  }*/



}
