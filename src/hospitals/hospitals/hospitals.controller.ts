import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { hospitalsI } from '../hospital.interface/hospital.interface';
import { hospitalDto } from '../hospitalDto/hospital.dto';
import { HospitalsService } from './hospitals.service';

@Controller('api/hospitals')
export class HospitalsController {
   
    constructor( private hospitalSvc: HospitalsService ){}

    @Get('/')
    @UseGuards(AuthGuard())
    async getHospitals( @Res() res: Response ){
        const hospitals: hospitalsI[] = await this.hospitalSvc.getHospitals();
        return res.status(HttpStatus.OK).json(hospitals);
    }

    @Post('/new')
    @UseGuards(AuthGuard())
    async createHospital( @Res() res: Response, @Req() req: Request, @Body() hospital: hospitalDto ) {  
        const user = <JwtPayload>req.user;

        const created = await this.hospitalSvc.createHospital(user._id, hospital);
        return res.status(HttpStatus.OK).json({hospital: created});
    }

    @Put('/edit/:id')
    @UseGuards(AuthGuard())
    async deleteHospital( @Res() res: Response, @Param('id') hospitalId: any, @Body() hospital: hospitalDto ) {
        const updated = await this.hospitalSvc.updateHospital(hospital, hospitalId);
        return res.status(HttpStatus.OK).json({hospital: updated});
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    async deleteUser( @Res() res: Response, @Param('id') hospitalId: any) {
       const deleted = await this.hospitalSvc.removeHospital(hospitalId);
       return res.status(HttpStatus.OK).json({message: `hospital eliminado: ${deleted}`});
    }

    @Post('/image/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './hospitals',
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }),
    )
    async posthospitalImg(@Res() res: Response, @UploadedFile() file: any, @Param('id') hospitalId: string ){
        const doctor = await this.hospitalSvc.postHospitalImg(file.filename, hospitalId);

        return res.status(HttpStatus.OK).json(doctor);
    }

    @Get('image/:imageFile')
    @UseGuards(AuthGuard())
    async getHospitalImage(@Res() res: Response, @Param('imageFile') image ){
        return res.sendFile(image, { root: './hospitals'});
    }
}
