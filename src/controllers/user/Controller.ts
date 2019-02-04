import { Request, Response } from 'express';
import { successHandler } from '../../libs/routes';
import UserRepository from './../../repositories/user/UserRepository';
class ControllerTrainee {
    // private constructor(){};
    public get(req: Request, res: Response) {
        try {
            UserRepository.userFind({email: req.body}).then((fetched) => {
                const { name, role, email, _id } = fetched;
                console.log('123456789345678', name, role, email);
                const data = {
                    Email: email,
                    ID: _id,
                    Name: name,
                    Role: role,
                };
                console.log('user');
                res.status(200).send(successHandler("It's get request", data, 200));
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public create(req: Request, res: Response, next) {
        try {
            const { name, email } = req.body;
            console.log('request body', req.body);
            const data = {
                Email: email,
                Name: name,
            };
            UserRepository.userCreate(req.body)
            .then(() => {
                res.status(201).send(successHandler("It's post request", data, 201));
            });
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    public modify(req: Request, res: Response, next) {
        try {
            const { dataToUpdate } = req.body;
            const data = {
                updatedData: dataToUpdate,
            };
            UserRepository.userUpdate(dataToUpdate)
            .then(() => {
                res.status(201).send(successHandler('Given data is updated', data, 200));
            });
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    public delete(req: Request, res: Response, next) {
        try {
            const { id } = req.params;
            console.log('in controller delete');
            UserRepository.userDelete(req.params)
                .then(() => {
                res.status(202).send(successHandler('Data is deleted', id, 202));
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
export default new ControllerTrainee();
