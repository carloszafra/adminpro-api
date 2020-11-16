import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/users/userDTO/user.dto';
import { RegistrationStatus } from '../interfaces/registration.interface';
import { logeduserDto } from 'src/users/userDTO/logeduser.dto';
import { userI } from 'src/users/user.interface/user.interface';
import { JwtPayload } from '../interfaces/payload.interface';
import { menu } from '../../utils/menu.utils';

@Injectable()
export class AuthService {

    constructor(
        private userSvc: UsersService,
        private jwtSvc: JwtService
    ){}

    async register( user: userDto ): Promise<any> {
        let status: RegistrationStatus ={
            success: true,
            message: 'user registered'
        }
        try{
            const newUser = await this.userSvc.registerUser(user);
            const token = this.createToken(newUser);
            status.token = token;
            const _menu = menu(newUser._id);

            return {user: newUser.email, menu: _menu, ...token}
        }catch(err){
            status = {
                success: false,
                message: err
            }
        }

        
    }

    async login( user: logeduserDto ): Promise<any> {
       const userLogged = await this.userSvc.loginUser( user );
       const token = this.createToken(userLogged);
       const _menu = menu(userLogged.role);

       return { user: userLogged.email, menu: _menu, ...token}; 
    }

    async renewToken( userId: string ): Promise<any>{
       const user = await this.userSvc.findById(userId)
       const token = this.createToken(user);
       const _menu = menu(user._id)

       const identity = {
           _id: user._id,
           name: user.name,
           email: user.email,
           img: user.img,
           google: user.google,
           role: user.role,
           timestamp: user.timestamp
        }
 
       return { identity, menu: _menu, ...token};
    }

    private createToken({_id}: userI): any {
        const user: JwtPayload = {_id};
        const accessToken = this.jwtSvc.sign(user);

        return {
            expiresIn: process.env.EXP_TOKEN,
            accessToken: accessToken
        }
    }

    async validateUser( payload: JwtPayload): Promise<userI> {
        const user = this.userSvc.findByPayload( payload );
        if(!user) throw new HttpException('not found',HttpStatus.UNAUTHORIZED);

        return user;
    }

    async validateGoogleUser( user: any ):Promise<any> {
        
       let userDB: userI = await this.userSvc.findByEmail(user.email);

       if(!userDB){
           userDB = await this.userSvc.registerGoogleUser(user);
       }

       const token = this.createToken(userDB);
 
       return { user: userDB, ...token};
    }

    googleLogin(req: any){
        if(!req.user){
            return 'no user from google';
        }

        return  {
            message: 'user information',
            user: req.user
        }
    }
}
