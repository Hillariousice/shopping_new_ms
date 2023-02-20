import { ValidateSignature } from '../../utils';
import {Request, Response, NextFunction} from 'express'

const UserAuth = async (req:Request,res:Response,next:NextFunction) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}

export default UserAuth