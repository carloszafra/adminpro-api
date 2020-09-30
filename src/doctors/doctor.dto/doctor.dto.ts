import { IsMongoId } from 'class-validator';

export class doctorDto {
    name: string;
    imageUrl: string;
    creator: string;
    @IsMongoId() hospital: string;
    timestamp: Date
}