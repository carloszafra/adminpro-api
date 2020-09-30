import { Module } from '@nestjs/common';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { userSchema } from 'src/users/user.schema/user.schema';
import { doctorSchema } from 'src/doctors/doctor.schema/doctor.schema';
import { hospitalSchema } from 'src/hospitals/hospital.schema/hospital.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Doctor', schema: doctorSchema },
      { name: 'Hospital', schema: hospitalSchema }
    ])
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
