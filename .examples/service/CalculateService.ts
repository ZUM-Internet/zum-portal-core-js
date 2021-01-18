import {Service} from "../../backend/decorator/Alias";
import {Yml} from "../../backend/decorator/Yml";
import {PostConstructor} from "../../backend/decorator/Component";
import Axios from "axios";
import {Caching} from "../../backend/decorator/Caching";

@Service()
export class CalculateService {
  constructor(@Yml('application') private application?: any) {
    console.log('constructor')
  }

  @PostConstructor()
  public async post1() {
    const r1 = this.test();
    const r2 = this.test();
    const r3 = this.test();


  }
  @PostConstructor()
  public async post2() {
    console.log('post constructor2')
    // console.log('result2', await this.test())
  }

  @Caching({key: 'test', unless: (result) => result.completed === true})
  public async test() {
    console.log('go man')
    const result = await Axios.get('https://jsonplaceholder.typicode.com/todos/1');
    return {data: result.data}
  }


  public add(x, y) {
    return x + y;
  }
}
