import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor( private authSvc: AuthService ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3002/auth/google/callback',
            scope: ['email', 'profile'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos, displayName } = profile
        console.log(profile);
        const user_ = {
            email: emails[0].value,
            name: displayName,
            firstName: name.givenName,
            lastName: name.familyName,
            img: photos[0].value,
            accessToken
        };

        const user = await this.authSvc.validateGoogleUser(user_);
        done(null, user);
    }
}