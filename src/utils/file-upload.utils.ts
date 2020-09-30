import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return callback(new Error('Only images allowed'), false);
    }

    callback(null, true);
}

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const random = Array(4)
    .fill(null)
    .map( () => Math.round(Math.random()*16).toString(16))
    .join('');

    callback(null, `${name}-${random}${fileExtName}`);
}