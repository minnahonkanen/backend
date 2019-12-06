const http = require('http')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const getInfo = () => {
    const count = persons.length
    const infoString = `Phonebook has info for ${count} people.`
    return infoString
}

const generateId = () => {
    const id = Math.floor(Math.random() * 100) + 1;
    if (persons.find(person => person.id === id)) {
        generateId()
    } else {
        return id
    }
}

app.get('/api/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.get('/info', (request, response) => {
    const timestamp = new Date()
    response.send(`<p>${getInfo()}</p> \n ${timestamp}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    if (persons.find(person => person.name === newPerson.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})