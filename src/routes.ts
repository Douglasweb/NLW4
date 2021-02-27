import { Router } from 'express';

import { UserController } from './controller/UserController';
import { SurveysController } from './controller/SurveysController';
import { SendMailController } from './controller/SendMailController';
import { AnswerController } from './controller/AnswerController';
import { NpsController } from './controller/NpsController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

//#region Users

router.post('/users', userController.create);

router.get('/users/:id', userController.getById);

router.get('/users/email/:string', userController.getByEmail);

router.get('/users/name/:string', userController.getByName);

//#endregion

//#region Surveys

router.post('/surveys', surveysController.create);

router.get('/surveys', surveysController.showall);

//#endregion

//#region UserSurveys

router.post('/sendmail', sendMailController.execute);

//#endregion


//#region Answer

router.get('/answers/:value', answerController.execute);

//#endregion

//#region Nps

router.get('/nps/:survey_id', npsController.execute);

//#endregion

export { router };