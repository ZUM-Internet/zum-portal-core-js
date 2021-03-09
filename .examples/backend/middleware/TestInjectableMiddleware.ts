import {Component} from "../../../backend/decorator/Component";
import {Request, Response, NextFunction} from "express";
import {Inject} from "../../../backend/decorator/Alias";
import {CalculateService} from "../service/CalculateService";
import {putVariantCookies} from '../../../backend/util/ABTestUtils';

@Component()
export default class TestInjectableMiddleware {
  constructor(@Inject(CalculateService) private calculateService: CalculateService) {
  }


  public setup(req: Request, res: Response, next: NextFunction) {
    // console.log('hi', this.calculateService.add(10, 20));

    putVariantCookies(req, res, {
      example: {
        A: 0.1,
        B: 0.2,
        C: 0.3,
        D: 0.4,
      }
    });

    next();
  }

}
