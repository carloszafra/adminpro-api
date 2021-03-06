import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { doctorDto } from '../doctor.dto/doctor.dto';
import { imgdoctorDto } from '../doctor.dto/imageDoctor.dto'
import { doctorI } from '../doctor.interface/doctor.interface';
import { DoctorsService } from './doctors.service';

@Controller('api/doctors') 
export class DoctorsController {
    
    constructor( private doctorSvc: DoctorsService, private cloudSvc: CloudinaryService ){}

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
        return res.status(HttpStatus.OK).json({doctors: doctors});
    }
    
    @Get('/:id')
    @UseGuards(AuthGuard())
    async getDoctor( @Res() res: Response, @Param('id')doctorId: string){
        const doctor = await this.doctorSvc.getDoctor(doctorId);

        return res.status(HttpStatus.OK).json(doctor);
    }

    @Put('/edit/:id')
    @UseGuards(AuthGuard())
    async updateDoctor
    ( @Res() res: Response, @Param('id') doctorId: any, @Body() doctorDto: doctorDto, @Req() req: Request ){
        const user = <JwtPayload>req.user;
        const updated = await this.doctorSvc.updateDoctor(doctorId, doctorDto, user._id);

        return res.status(HttpStatus.OK).json({hospital: updated});
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    async deleteDoctor( @Res() res: Response, @Param('id') doctorId: any ){
        const deleted = await this.doctorSvc.deleteDoctor(doctorId);
        return res.status(HttpStatus.OK).json({message: `doctor eliminado: ${deleted}`});
    }


    @Post('/image/:id')
    @UseGuards(AuthGuard())
    async postDoctorImg(@Res() res: Response, @Body() file:imgdoctorDto, @Param('id') doctorId: string ){
        console.log(file)
        const doctor = await this.doctorSvc.postDoctorImg(file.imageUrl, doctorId);
        console.log(doctor)

        return res.status(HttpStatus.OK).json(doctor);
    }

    @Post('/cloudinary')
    @UseInterceptors(FileInterceptor('image'))
    async postImage(@Res() res: Response, @UploadedFile() file: any){
        console.log(file)
        const resp = await this.cloudSvc.uploadFile(file);
        return res.status(200).json(resp);
    }

    @Get('image/:imageFile')
    async getDoctorImage(@Res() res: Response, @Param('imageFile') image ){
        return res.sendFile(image, { root: './doctors'});
    }
}
