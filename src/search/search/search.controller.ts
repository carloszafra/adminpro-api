import { Controller, Get, HttpStatus, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { userI } from 'src/users/user.interface/user.interface';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {

    constructor( private searchSvc: SearchService ){}

    @Get('/:param')
    @UseGuards(AuthGuard())
    async searchByParam( @Res() res: Response, @Req() req: Request, @Param('param') param: any ) {
       const [users, hospitals, doctors] = await this.searchSvc.searchByParam(param);
        
       return res.status(HttpStatus.OK).json({users, hospitals, doctors});
    }

    @Get('/:collection/:param')
    @UseGuards(AuthGuard())
    async searchByCollection
    ( @Res() res: Response, @Req() req: Request, @Param('collection') collection: any, @Param('param') param: any){
      
        const result = await this.searchSvc.searchByCollection(collection, param);

       return res.status(HttpStatus.OK).send(result);
    }
}
