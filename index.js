const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

let persons = [
    {
        id: 1,
        name: 'test',
        number: '123'
    },
    {
        id: 2,
        name: 'test2',
        number: '1234'
    },
    {
        id: 3,
        name: 'test3',
        number: '12345'
    }
]
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// add that damn zero
const pad = (n) => {
    return n < 10 ? '0' + n : n
}

// info
app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p> ${Date()} </p>`)
})

// valitun hakeminen
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(p => p.id === id)
    if (person.length === 1) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// valitun poisto
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name===undefined || body.number===undefined) {
        return res.status(400).json({
            error: 'You must enter name and number'
        })
    }
    if(persons.find(p=>p.name===body.name)){
        return res.status(400).json(
            { error: 'Name must be unique' }
        )
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})