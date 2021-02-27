import {
    Request,
    Response
} from "express";
import {
    getCustomRepository
} from "typeorm";
import { AppErrors } from "../Errors/AppErrors";
import {
    SurveyUserRepository
} from "../repositories/SurveyUserRepository";


class AnswerController {

    async execute(request: Request, response: Response) {
        const {
            value
        } = request.params;

        const {
            u
        } = request.query;

        if (isNumeric(value)) {
            throw new AppErrors('Survey note does not exists!');     
            
        }

        if (!u) {
            throw new AppErrors('Survey does not exists!');            
        }

        const surveysUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyuser = await surveysUserRepository.findOne({
            id: String(u)
        });

        if (!surveyuser) {
            throw new AppErrors('Survey User does not exists!');          
        }

        if (surveyuser.value != null) {
            throw new AppErrors('Survey already answer!');           
        }

        surveyuser.value = Number(value);

        await surveysUserRepository.save(surveyuser);

        response.status(200).json(surveyuser);

    }



}

function isNumeric(num) {
    return isNaN(num)
}

export {
    AnswerController
};