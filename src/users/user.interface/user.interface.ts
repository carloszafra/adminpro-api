import { Document } from 'mongoose';

export interface userI extends Document{
    _id: string;
    name: string;
    email: string;
    password: string;
    img: string;
    role: string;
    google: boolean;
    timestamp: Date;
    hashPassword( password: string): Promise<string>;
    comparePasswords( password: string ): Promise<boolean>
}