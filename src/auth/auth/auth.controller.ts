import { Controller, Post, Body, HttpException, HttpStatus, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from 'src/users/userDTO/user.dto';
import { RegistrationStatus } from '../interfaces/registration.interface';
import { logeduserDto } from 'src/users/userDTO/logeduser.dto';
import { userI } from 'src/users/user.interface/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtPayload } from '../interfaces/payload.interface';

@Controller('auth')
export class AuthController {
    
    constructor( private authSvc: AuthService ){}

    @Post('/register')
    public async register( @Body() user: userDto, @Res() res ): Promise<any> {
        const newUser: userI = await this.authSvc.register(user);
        if(!newUser) throw new HttpException('error al registrar el usuario', HttpStatus.BAD_REQUEST);

        return res.status(HttpStatus.OK).json(newUser);
    }
 
    @Post('/login')
    public async login( @Body() user: logeduserDto ): Promise<userI> {
        return await this.authSvc.login(user);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google')) 
    googleLogin(@Req() req){} 
 
    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res: Response){
        const response: any = this.authSvc.googleLogin(req);
        //return res.status(200).json(response.user.accessToken)
        res.redirect(`http://localhost:4200/google/${response.user.accessToken}`)
    }

    @Get('renew')
    @UseGuards(AuthGuard())
    async renewToken( @Res() res: Response, @Req() req: Request ){
        const userlog = <JwtPayload>req.user;
        const user = await this.authSvc.renewToken(userlog._id);

        return res.status(HttpStatus.OK).json({user, true: true});
    }
}
