import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { doctorDto } from '../doctor.dto/doctor.dto';
import { doctorI } from '../doctor.interface/doctor.interface';
import { DoctorsService } from './doctors.service';

@Controller('api/doctors')
export class DoctorsController {
    
    constructor( private doctorSvc: DoctorsService ){}

    @Post('/new')
    @UseGuards(AuthGuard())
    async createDoctor
    (@Res() res: Response, @Req() req: Request, @Body() doctorDto: doctorDto){
       const user = <JwtPayload>req.user;
       const doctor: doctorI = await this.doctorSvc.createDoctor(user._id, doctorDto);

       return res.status(HttpStatus.OK).json(doctor);
    }

    @Get('/')
    @UseGuards(AuthGuard())
    async getDoctors( @Res() res: Response){
        const doctors: doctorI[] = await this.doctorSvc.getDoctors();
        return res.status(HttpStatus.OK).json(doctors);
    }

    @Post('/image/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './doctors',
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }),
    )
    async postDoctorImg(@Res() res: Response, @UploadedFile() file: any, @Param('id') doctorId: string ){
        const doctor = await this.doctorSvc.postDoctorImg(file.filename, doctorId);

        return res.status(HttpStatus.OK).json(doctor);
    }

    @Get('image/:imageFile')
    @UseGuards(AuthGuard())
    async getDoctorImage(@Res() res: Response, @Param('imageFile') image ){
        return res.sendFile(image, { root: './doctors'});
    }
}
