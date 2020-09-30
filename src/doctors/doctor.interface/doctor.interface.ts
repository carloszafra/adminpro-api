import { Document } from 'mongoose';

export interface doctorI extends Document {
    name: string;
    imageUrl: string;
    creator: string;
    hospital: string;
    timestamp: Date
}