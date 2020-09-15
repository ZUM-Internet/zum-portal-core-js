import "reflect-metadata"
import {Application} from "express";
import BaseAppContainer from "../backend/BaseAppContainer";
import {Singleton} from "../backend/decorator/Alias";
import {container} from "tsyringe";
import {Middleware} from "../backend/decorator/Middleware";

// app container
@Singleton()
@Middleware([
  (req, res, next) => {console.log('dd');next()},
  (req, res, next) => {console.log('12345');next()},
] )
export class AppContainer extends BaseAppContainer {
  public app: Application;

  constructor() {
    super({ dirname: './.examples' });
  }

  public listen() {
    this.app.listen(8080, () => console.log('startup'));
  }
}

// startup
container.resolve(AppContainer).listen();
