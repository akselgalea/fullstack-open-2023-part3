require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { notFoundMiddleware } = require('./middleware/notFound')
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

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
      Phonebook has info for ${persons.length} people <br/>
      ${new Date()}
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if(!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  if(persons.some(person => person.name === name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: generateId(),
    name,
    number
  }

  persons = persons.concat(newPerson)

  response.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(persons);
  
  response.status(204).end()
})

app.use(notFoundMiddleware)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})