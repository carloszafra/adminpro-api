import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { doctorI } from 'src/doctors/doctor.interface/doctor.interface';
import { hospitalsI } from 'src/hospitals/hospital.interface/hospital.interface';
import { userI } from 'src/users/user.interface/user.interface';

@Injectable()
export class SearchService {

    constructor(
        @InjectModel('User') private userModel: Model<userI>,
        @InjectModel('Hospital') private hospitalModel: Model<hospitalsI>,
        @InjectModel('Doctor') private doctorModel: Model<doctorI>
    ) { }

    async searchByParam(param: any): Promise<any> {
        const regex = new RegExp(param, 'i');

        const searchResults = await Promise.all([
            this.userModel.find({ name: regex }, 'name email role google'),
            this.hospitalModel.find({ name: regex }).populate('creator', 'name email role google'),
            this.doctorModel.find({ name: regex }).populate('creator', 'name email role google')
        ]);

        return searchResults;
    }


    async searchByCollection(collection: string, param: string): Promise<any> {
        const regex = new RegExp(param, 'i');
        let data = [];

        switch (collection) {
            case 'doctors':

                data = await this.doctorModel.find({ name: regex })
                    .populate('creator', 'name email role google');

                return data
                
            case 'hospitals':

                data = await this.hospitalModel.find({ name: regex })
                    .populate('creator', 'name email role google');
           
                    return data

            case 'users':

                data = await this.userModel.find({ name: regex }, 'name email role google');
                return data

 
            default:

                throw new NotFoundException(HttpStatus.NOT_FOUND, 'Collection not found')
        }

    }
}
