import { IsNotEmpty, IsEmail } from 'class-validator';

export class userDto{
    @IsEmail()
    email: string;
    
    @IsNotEmpty() name: string;
    
    @IsNotEmpty() password: string;

    img: string;

    role: string;

    google: boolean;

    timestamp: Date
}