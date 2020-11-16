import { Controller, Get, Put, UseGuards, Res, Param, Req, Body, NotAcceptableException, HttpStatus, NotImplementedException, Delete, HttpException, Query, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { userDto } from '../userDTO/user.dto';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { edituserDto } from '../userDTO/edituser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../../utils/file-upload.utils';


@Controller('api/users')
export class UsersController {

  constructor(private userSvc: UsersService) { }
 
  @Get('/')
  @UseGuards(AuthGuard())
  async getUsers(@Res() res: Response, @Query('from') from: any) {
    const desde = from ? Number(from) : 0; 
    console.log(desde);
    const [users, total] = await this.userSvc.getUsers(desde);
 
    return res.status(HttpStatus.OK).json({ users, total });
  }

  @Put('edit/:id')
  @UseGuards(AuthGuard())
  async updateUser(@Res() res: Response, @Body() userDto: edituserDto, @Param('id') userId: any, @Req() req: Request) {
    const user = <JwtPayload>req.user;

   // if (userId != user._id) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');

    const userUpdated = await this.userSvc.updateUser(userId, user._id, userDto);
    if (!userUpdated) throw new NotImplementedException(HttpStatus.NOT_IMPLEMENTED, 'no se ha podido actualizar el usuario');

    return res.status(HttpStatus.OK).json(userUpdated);
  }

  @Put('edit/profile/:id')
  @UseGuards(AuthGuard())
  async updateProfile(@Res() res: Response, @Body() userDto: edituserDto, @Param('id') userId: any, @Req() req: Request){
    const user = <JwtPayload>req.user;

    if (userId != user._id) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');
    const userUpdated = await this.userSvc.updateProfile(userId, userDto);
    
    return res.status(HttpStatus.OK).json(userUpdated);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard()) 
  async deleteUser(@Res() res: Response, @Param('id') userId, @Req() req: Request) {
    const user = <JwtPayload>req.user;

    if (userId == user._id) throw new NotAcceptableException(HttpStatus.UNAUTHORIZED, 'no autorizado');

    const userDeleted = await this.userSvc.deleteUser(userId);
    if (!userDeleted) throw new HttpException('error al eliminar', HttpStatus.BAD_REQUEST);

    return res.status(HttpStatus.OK).json({ message: 'usuario eliminado' });
  }

  @Post('/image/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './users',
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }),
  )
  async uploadUserImg
  (@Res() res: Response, @Req() req: Request, @UploadedFile() file: any, @Param('id')userId: string){
    const userUpdated = await this.userSvc.updateUserImg(file.filename, userId);

    return res.status(HttpStatus.OK).json(userUpdated);
  }

  @Get('image/:imageFile')
  async getUserImg( @Res() res: Response, @Param('imageFile') image: any ){
    return res.sendFile(image, { root: './users' });
  }

  
}
