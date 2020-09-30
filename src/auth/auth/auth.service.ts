import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/users/userDTO/user.dto';
import { RegistrationStatus } from '../interfaces/registration.interface';
import { logeduserDto } from 'src/users/userDTO/logeduser.dto';
import { userI } from 'src/users/user.interface/user.interface';
import { JwtPayload } from '../interfaces/payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private userSvc: UsersService,
        private jwtSvc: JwtService
    ){}

    async register( user: userDto ): Promise<RegistrationStatus> {
        let status: RegistrationStatus ={
            success: true,
            message: 'user registered'
        }
        try{
            const newUser = await this.userSvc.registerUser(user);
            const token = this.createToken(newUser);
            status.token = token;
        }catch(err){
            status = {
                success: false,
                message: err
            }
        }

        return status;
    }

    async login( user: logeduserDto ): Promise<any> {
       const userLogged = await this.userSvc.loginUser( user );
       const token = this.createToken(userLogged);

       return { user: userLogged.email, ...token};
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
