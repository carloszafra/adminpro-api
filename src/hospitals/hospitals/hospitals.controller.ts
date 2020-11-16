import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async getHospitals( @Res() res: Response, @Query('from')from: string ){
        const desde = from ? Number(from) : 0;
        const [hospitals, total]= await this.hospitalSvc.getHospitals(desde);
        return res.status(HttpStatus.OK).json({hospitals, total});
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
    async updateHospital
    ( @Res() res: Response, @Param('id') hospitalId: any, @Body() hospital: hospitalDto, @Req() req: Request ) {
        const user = <JwtPayload> req.user;
        
        const updated = await this.hospitalSvc.updateHospital(hospital, hospitalId, user._id);
        return res.status(HttpStatus.OK).json({hospital: updated});
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    async deleteHospital( @Res() res: Response, @Param('id') hospitalId: any) {
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
    async getHospitalImage(@Res() res: Response, @Param('imageFile') image ){
        return res.sendFile(image, { root: './hospitals'});
    }
}
