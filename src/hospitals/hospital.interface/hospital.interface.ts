import { Document } from 'mongoose';

export interface hospitalsI extends Document {
   name: string;
   imageUrl: string;
   creator: string
}