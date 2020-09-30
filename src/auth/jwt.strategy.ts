import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interfaces/payload.interface";
import { userI } from "src/users/user.interface/user.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor( private authSvc: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY
        })
    }

    async validate( payload: JwtPayload ): Promise<userI> {
        const user = await this.authSvc.validateUser(payload);
        if(!user) throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
        
        return user;
    }
}