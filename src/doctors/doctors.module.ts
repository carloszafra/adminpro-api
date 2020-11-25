import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { hospitalSchema } from 'src/hospitals/hospital.schema/hospital.schema';
import { doctorSchema } from './doctor.schema/doctor.schema';
import { DoctorsController } from './doctors/doctors.controller';
import { DoctorsService } from './doctors/doctors.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Doctor', schema: doctorSchema },
      { name: 'Hospital', schema: hospitalSchema }
    ]),
    CloudinaryModule
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService]
})
export class DoctorsModule {}
