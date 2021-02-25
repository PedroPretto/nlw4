import {Request, response, Response} from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import {SurveyUsersRepository} from '../repositories/SurveysUsersRepository'
import SendMailService from '../services/SendMailService'
import {resolve} from 'path'
class SendMailController {
  async execute(req: Request, res: Response){
    const {email, survey_id} = req.body

    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const user = await usersRepository.findOne({email})

    if(!user){
      return res.status(400).json({
        error: 'User does not exist!'
      })
    }

    const survey = await surveysRepository.findOne({id: survey_id})

    if(!survey){
      return res.status(400).json({
        error: 'Survey dos not exist!'
      })
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{user_id: user.id}, {value: null}],
      relations: ['user', 'survey']
    })

    const variable = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }
    const npsPath =  resolve(__dirname, '..', 'view', 'emails', 'npsMail.hbs')

    if(surveyUserAlreadyExists){
      await SendMailService.execute(email, survey.title, variable, npsPath)
      return res.json(surveyUserAlreadyExists)
    }

    // Salvar infos na tabela surveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    })
    await surveysUsersRepository.save(surveyUser)
    // Enviar email para o usuário
    
    
    await SendMailService.execute(email, survey.title, variable, npsPath)

     return res.json(surveyUser)
  }
}

export {SendMailController}