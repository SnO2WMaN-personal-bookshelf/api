import {HttpModule, Module} from '@nestjs/common';
import {OpenBDService} from './openbd.service';

@Module({
  imports: [HttpModule],
  providers: [OpenBDService],
})
export class OpenBDModule {}
