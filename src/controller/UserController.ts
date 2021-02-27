import {
    Request,
    Response
} from 'express';
import {
    getCustomRepository
} from 'typeorm';
import {
    UsersRepository
} from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppErrors } from '../Errors/AppErrors';


class UserController {

    async create(request: Request, response: Response) {
        const {
            name,
            email
        } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required('Nome obrigatório'),
            email: yup.string().email('Email incorreto').required('email obrigatorio')
        });


        try {
            await schema.validate(request.body, {
                abortEarly: false
            });

        } catch (err) {
            return response.status(400).json({
                error: err
            });
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new AppErrors('User Already exists!');           
        }

        const user = usersRepository.create({
            name,
            email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }


    async getById(request: Request, response: Response) {

        const id = request.params['id'];

        console.log(id);

        if (!id || id == undefined || id === null || id === undefined || id == '') {
            throw new AppErrors('', 404);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            id: String(id)
        });

        if (userAlreadyExists) {
            return response.json(userAlreadyExists);
        }

        return response.status(404).json();

    }


    async getByEmail(request: Request, response: Response) {

        const email = request.params['string']

        if (!email || email == undefined || email === null || email === undefined || email == '') {
            throw new AppErrors('', 404);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email: String(email)
        });

        if (userAlreadyExists) {
            return response.json(userAlreadyExists);
        }

        return response.status(404).json();

    }


    async getByName(request: Request, response: Response) {

        const name = request.params['string']

        if (!name || name == undefined || name === null || name === undefined || name == '') {
            throw new AppErrors('', 404);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            name: String(name)
        });

        if (userAlreadyExists) {
            return response.json(userAlreadyExists);
        }

        return response.status(404).json();

    }

}


export {
    UserController
};