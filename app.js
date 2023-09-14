const express = require('express')
const app = express()
const morgan = require('morgan')
const { notFoundMiddleware } = require('./middleware/notFound')

app.disable('x-powered-by')

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

const generateId = () => {
  const maxVal = 100000
  return Math.floor(Math.random() * maxVal)
}

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.get('/', (request, response) => {
  response.send('Phonebook API')
})

app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${persons.length} people <br/>
    ${new Date()}
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) return response.json(person)
  
  response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if(!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  if(persons.some(person => person.name === name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  persons = persons.concat({
    id: generateId(),
    name,
    number
  })

  response.status(201).json(persons)
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