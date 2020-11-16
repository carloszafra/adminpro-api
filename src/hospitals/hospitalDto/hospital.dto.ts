import { IsNotEmpty } from 'class-validator';

export class hospitalDto {
   @IsNotEmpty() name: string;
    imageUrl: string;
}