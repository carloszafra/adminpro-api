import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { userSchema } from './user.schema/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef( () => AuthModule ),
    MongooseModule.forFeature([
        { name: 'User', schema: userSchema }
    ]),
    MulterModule.register()
  ],  
  controllers: [UsersController],
  providers: [UsersService],
  exports: [ UsersService ]
})
export class UsersModule {}
