import { Injectable, NotFoundException, MethodNotAllowedException, HttpException, HttpStatus, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userI } from '../user.interface/user.interface';
import { userDto } from '../userDTO/user.dto';
import { logeduserDto } from '../userDTO/logeduser.dto';
import { edituserDto } from '../userDTO/edituser.dto';

@Injectable()
export class UsersService {

    constructor( @InjectModel('User') private userModel: Model<userI> ){}

    private async userRole(userId: string): Promise<boolean>{
       let isAdmin: boolean = false;
       const user: userI = await this.findById(userId);
       (user.role === "ADMIN_ROLE") ? isAdmin = true : isAdmin = false;

       return isAdmin;
    }

    async findByEmail(email: string): Promise<userI> {
        const user = await this.userModel.findOne({email: email});
        return user;
    }

    async findById(id: string): Promise<userI> {
        const user = await this.userModel.findOne({_id: id});
        return user;
    }

    async findByPayload({_id}: any): Promise<userI> {
        const user = await this.userModel.findOne({_id: _id});
        return user;
    }

    async registerUser( user: userDto ): Promise<userI> {
        try{

            const emailExists = await this.userModel.findOne({email: user.email});
            if(emailExists) throw new HttpException('el correo ya existe', HttpStatus.NOT_ACCEPTABLE);
            
            const newUser: userI = new this.userModel(user);
            newUser.password = await newUser.hashPassword( newUser.password );
            newUser.img = null;
            const savedUser = await newUser.save();
            return savedUser;

        }catch(err){
           throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }   

    async loginUser( logeduser: logeduserDto ): Promise<userI> {
        const user = await this.userModel.findOne({ email: logeduser.email });
        if(!user) throw new NotFoundException('user not found');

        const correctPassword = await user.comparePasswords(logeduser.password);
        if(!correctPassword) throw new MethodNotAllowedException('not autorized');
        console.log(user);
        return user;
    }

    async updateUser( userId: string, userLog: string ,user: edituserDto ): Promise<userI>{
        const emailExists = await this.userModel.findOne({email: user.email});
        if(emailExists) throw new NotImplementedException(HttpStatus.NOT_IMPLEMENTED, 'the email is already used');

        const isAdmin = await this.userRole(userLog);
        if(!isAdmin) throw new MethodNotAllowedException(HttpStatus.UNAUTHORIZED);

        const userUpdated = await this.userModel.findByIdAndUpdate(userId, user, {new: true});
        if(userUpdated.google){
            userUpdated.email = user.email;
        }
        
        return userUpdated;
    }

    async updateProfile( userId: string, user: edituserDto): Promise<userI>{
        const emailExists = await this.userModel.findOne({email: user.email});
        if(emailExists) throw new NotImplementedException(HttpStatus.NOT_IMPLEMENTED, 'the email is already used');

        const userUpdated = await this.userModel.findByIdAndUpdate(userId, user, {new: true});
        if(userUpdated.google){
            userUpdated.email = user.email;
        }
        
        return userUpdated;
    }

    async deleteUser( userId: any ): Promise<any> {
        
        try {
            const deleted = await this.userModel.deleteOne({_id: userId});
            return deleted 
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED)
        }
    }

    async getUsers( from: number ): Promise<any[]> {
       const users = await Promise.all([
           this.userModel.find({}, 'name email role google img').skip(from).limit(5),
           this.userModel.countDocuments()
        ])

        return users; 
    }
    async updateUserImg( fileUrl: any, userId: string ): Promise<userI> {
       try {
           const user = await this.userModel.findOneAndUpdate({_id: userId}, {img: fileUrl}, {new: true});
           return user;
       } catch (error) {
           throw new HttpException('no se pudo subir la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    async registerGoogleUser( user: any ):Promise<userI> {
        try {
            const newUser = new this.userModel();
            newUser.password = '@@@';
            newUser.name = user.name;
            newUser.img = user.img;
            newUser.google = true;
            newUser.email = user.email; 
            const savedUser = await newUser.save();

            return savedUser;
        } catch (error) {
            throw new HttpException(`${error} hubo un error al registrar`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

