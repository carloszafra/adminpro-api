import { Injectable, Inject } from '@nestjs/common';
import { Cloudinary } from '../cloudinary';

@Injectable()
export class CloudinaryService {
    private v2: any;
    constructor(
        @Inject(Cloudinary)
        private cloudinary
    ){
        this.cloudinary.v2.config({
            cloud_name: 'clubii',
            api_key: '241828177671656',
            api_secret: '7MpPg9LKCdlv12jSPmZ5Y1_Z6bM'
        })
        this.v2 = cloudinary.v2
    }

    async uploadFile(file:any){
        console.log(file);
       const resp = await this.v2.uploader.upload(file);
       console.log(resp)
       return resp;
    }
}
