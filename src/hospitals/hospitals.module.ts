import { Module } from '@nestjs/common';
import { HospitalsController } from './hospitals/hospitals.controller';
import { HospitalsService } from './hospitals/hospitals.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { hospitalSchema } from './hospital.schema/hospital.schema';
import { userSchema } from 'src/users/user.schema/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Hospital', schema: hospitalSchema },
      { name: 'User', schema: userSchema }
    ])
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService]
})
export class HospitalsModule {}
