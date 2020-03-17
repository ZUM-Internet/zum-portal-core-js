import {Service} from "../../backend/decorator/Alias";
import {Yml} from "../../backend/decorator/Yml";

@Service()
export class CalculateService {
  constructor(@Yml('application') private application?: any) {
  }
  public add(x, y) {
    return x + y;
  }
}
