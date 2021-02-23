import express, { response } from 'express'

const app = express()

app.get('/users', (request, response) => {
  return response.json({message: 'Hello World'})
})

app.post('/', (request, response)=> {
  return response.json({message: "Dados salvos com sucesso"})
})

app.listen(3333, () => {
  console.log('Server running')
})