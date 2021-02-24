import {Router} from 'express'
import { SurveysControler } from './controllers/SurveysController'
import { UserController } from './controllers/UserController'

const router = Router()

const userController = new UserController()
const surveysController = new SurveysControler()
router.post('/users', userController.create)
router.post('/surveys', surveysController.create)
router.get('/surveys', surveysController.show)
export {router}