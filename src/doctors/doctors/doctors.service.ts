import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { doctorDto } from '../doctor.dto/doctor.dto';
import { doctorI } from '../doctor.interface/doctor.interface';
import * as fs from 'fs';

@Injectable()
export class DoctorsService {

    constructor( @InjectModel('Doctor') private doctorModel: Model<doctorI> ){}

    async createDoctor(creatorId: string, doctorDto: doctorDto ): Promise<doctorI> {
       
        try {
            const newDoctor = new this.doctorModel(doctorDto);
            newDoctor.creator = creatorId;
            
            const savedDoctor = await newDoctor.save();
            await savedDoctor.populate('creator hospital', 'name _id').execPopulate();
            return savedDoctor;
        } catch (error) {
            throw new HttpException(`hable con el administrador: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateDoctor(doctorId: string, doctorDto: doctorDto, creatorId: string): Promise<doctorI> {
        const updated = await this.doctorModel
         .updateOne({_id: doctorId},{creator: creatorId, ...doctorDto});

        if(!updated) throw new HttpException('no se pudo actualizar el medico', HttpStatus.INTERNAL_SERVER_ERROR);

        return updated;
    }

    async deleteDoctor(doctorId: string): Promise<any>{
        let deleted = false;

        try {
            await this.doctorModel.deleteOne({_id: doctorId});
            deleted = true;
            return deleted;
        } catch (error) {
            throw new HttpException(`no se pudo borrar el doctor: ${deleted}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDoctors(): Promise<doctorI[]> {
        const doctors = await this.doctorModel.find()
        .populate('creator', 'name _id img')
        .populate('hospital', 'name _id imageUrl');

        if(!doctors.length) throw new NotFoundException(HttpStatus.NOT_FOUND, 'no hay doctores registrados');

        return doctors;
    }

    async getDoctor(id: string): Promise<doctorI> {
      try {
          const doctor = await this.doctorModel.findOne({_id: id})
             .populate('creator', 'name _id img')
             .populate('hospital', 'name _id imageUrl');
          return doctor;

        } catch (error) {
           throw new HttpException(`no se pudo encontrar: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async postDoctorImg( fileUrl: string, doctorId: string ): Promise<doctorI> {
        try {
            const doctor = await this.doctorModel.findOne({_id: doctorId});
            const oldPath = `./doctors/${doctor.imageUrl}`;

            if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

            doctor.imageUrl = fileUrl
            await doctor.save();
            return doctor;
            
        } catch (error) {
            throw new HttpException('no se pudo subir la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


