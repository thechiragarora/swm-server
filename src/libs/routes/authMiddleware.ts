// import { config } from "dotenv";
import * as jwt from 'jsonwebtoken';
import config from '../../config/configuration';
import UserRepository from '../../repositories/user/UserRepository';
import hasPermission from './hasPermissions';

export default function authMiddleware(module, permissionType) {
    return (req, res, next) => {
        const token = req.headers.authorization;
        const { key } = config;
        let decoded;
        console.log(token);
        try {
            decoded = jwt.verify(token, key);
        } catch (error) {
            return next({
                error: error.message,
                message: error.message,
                status: 500,
            });
        }
        req.body.data = decoded;
        const { role , email, name} = decoded;
        console.log('DECODE:::::', decoded);
        // console.log('data:::::', role, name, email);
        UserRepository.userFind(decoded).then(() => {
            if (!decoded) {
                next({
                    error: 'Unauthorized access',
                    message: 'User is unauthorized',
                    status: 401,
                });
            }
            const result = hasPermission(module, role, permissionType);
            if (result === false) {
                next({
                    error: 'Unauthorized',
                    message: 'permission denied',
                    status: 401,
                });
            }
        });
        next();
    };
}
