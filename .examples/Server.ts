import "reflect-metadata"
import {Application} from "express";
import BaseAppContainer from "../backend/BaseAppContainer";
import {Singleton} from "../backend/decorator/Alias";
import {container} from "tsyringe";

// app container
@Singleton()
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
