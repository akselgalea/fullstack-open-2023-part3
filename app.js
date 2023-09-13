const express = require('express')
const app = express()
app.disable('x-powered-by')

const persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 1
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 2
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 3
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}


app.use(express.json())

app.get('/', (request, response) => {
  response.send('Hola gente')
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

  if(!name || !number) return response.status(400).json({
    error: 'name and number are required'
  })

  const person = {
    id: generateId(),
    name,
    number
  }

  persons.concat(person)

  response.status(201).json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const filteredPersons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})