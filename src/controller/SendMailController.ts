import {
    json,
    Request,
    Response
} from "express";
import {
    getCustomRepository
} from "typeorm";
import {
    SurveysRepository
} from "../repositories/SurveysRepository";
import {
    SurveyUserRepository
} from "../repositories/SurveyUserRepository";
import {
    UsersRepository
} from "../repositories/UsersRepository";
import SendMailServices from "../services/SendMailService";

import {
    resolve
} from 'path';
import { AppErrors } from "../Errors/AppErrors";

class SendMailController {

    async execute(request: Request, response: Response) {

        const {
            email,
            survey_id
        } = request.body;


        const userRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveyUserRepository);


        const user = await userRepository.findOne({
            email
        });

        if (!user) {
            throw new AppErrors('User does not exists!');            
        }

        const survey = await surveysRepository.findOne({
            id: survey_id
        });

        if (!survey) {
            throw new AppErrors('Survey does not exists!');            
        }

        const surveyUserAlreadExists = await surveysUserRepository.findOne({
            where: { user_id: user.id, value: null, survey_id }
            //,relations : ["user", "survey"]
        });

        const npspath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const variables = {
            name : user.name,
            title: survey.title,
            description : survey.description,
            id :  "",
            link : process.env.URL_MAIL
        }
      

        if (surveyUserAlreadExists) {
            variables.id = surveyUserAlreadExists.id;
            await SendMailServices.execute(email, survey.title, variables, npspath);
            return response.json(surveyUserAlreadExists);
        }

        const surveyuser = surveysUserRepository.create({
            survey_id,
            user_id : user.id
        });

        await surveysUserRepository.save(surveyuser);   
        
        variables.id = surveyuser.id;

        await SendMailServices.execute(email, survey.title, variables, npspath);

        return response.json(surveyuser);

    }

}

export {  SendMailController }