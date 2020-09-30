import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hospitalsI } from '../hospital.interface/hospital.interface';
import { hospitalDto } from '../hospitalDto/hospital.dto';

@Injectable()
export class HospitalsService {

    constructor( @InjectModel('Hospital') private hospitalModel: Model<hospitalsI> ){}

    async getHospitals(): Promise<hospitalsI[]>{
        const hospitals = await this.hospitalModel.find().populate('creator', 'name _id img');
        if(!hospitals.length) throw new NotFoundException(HttpStatus.NOT_FOUND, 'No hay hospitales registrados');

        return hospitals;
    }

    async createHospital( creatorId: string, newHospital: hospitalDto): Promise<hospitalsI>{
         
        try {
            const hospital = new this.hospitalModel(newHospital);
            hospital.creator = creatorId;
            const savedHospital = await hospital.save();
            await savedHospital.populate('creator', 'name email').execPopulate();

            return savedHospital;
        } catch (error) {
            throw new HttpException('no se pudo crear el hospital', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateHospital( hospital: hospitalDto, hospitalId: string ): Promise<hospitalsI> {
        const updated = await this.hospitalModel.updateOne({_id: hospitalId}, hospital, {new: true});
        if(!updated) throw new HttpException('no se pudo actualizar el hospital', HttpStatus.INTERNAL_SERVER_ERROR);

        return updated;
    }

    async removeHospital( hospitalId: string ): Promise<any> {
        let deleted = false;
        
        try {
          await this.hospitalModel.deleteOne({_id: hospitalId});
          deleted = true;
          return deleted;

        } catch (error) {
            throw new HttpException(`no se pudo borrar el hospital: ${deleted}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   async postHospitalImg(fileUrl: string, hospitalId: string ): Promise<hospitalsI> {
       try{
          const hospital = await this.hospitalModel.updateOne({_id: hospitalId}, {imageUrl: fileUrl}, {new: true});
          return hospital;
       }catch(error){
           throw new HttpException('no se pudo subir la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
        }
       
    }
}
