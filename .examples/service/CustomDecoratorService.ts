import {Service} from "../../backend/decorator/Alias";
import {BeforeEx1, BeforeEx2} from "../decorator/BeforeDecorator";
import {AfterEx1, AfterEx2} from "../decorator/AfterDecorator";

@Service()
export default class CustomDecoratorService {
  constructor() {
  }

  @BeforeEx1()
  public beforeReplace(word: string) {
    return word;
  }


  @BeforeEx2()
  public beforeOddStop(value: number) {
    return 'ok';
  }


  @AfterEx1()
  public afterReplace(num: number) {
    return num;
  }


  @AfterEx2()
  public afterOddStop(num: number) {
    return num;
  }



}
