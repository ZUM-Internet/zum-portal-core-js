import {Module} from "@nestjs/common";
import { ZumProvisionAdapter } from "./zum.provision.adapter";

@Module({
  providers: [ZumProvisionAdapter],
  exports: [ZumProvisionAdapter],
})
export class AdapterModule {}
