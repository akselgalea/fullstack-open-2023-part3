require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const Person = require('./models/person')

app.disable('x-powered-by')

const generateId = () => {
  const maxVal = 100000
  return Math.floor(Math.random() * maxVal)
}

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    response.send(`
      Phonebook has info for ${persons.length} people <br/>
      ${new Date()}
    `)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) return response.json(person)
    
    response.status(404).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if(!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const person = new Person({
    name,
    number
  })

  person.save().then(savedPerson => {
    response.status(201).json(savedPerson)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    if(result) return response.status(204).end()
    
    response.status(404).end()
  }).catch(error => next(error))
})

app.use(notFound)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})