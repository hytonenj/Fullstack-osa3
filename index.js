require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :body'));



app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        console.log(people)
        res.json(people.map(p => p.toJSON()))
    })
    //res.json(persons)
})


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

//lisääminen
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name===undefined || body.number===undefined) {
        return res.status(400).json({
            error: 'You must enter name and number'
        })
    }
    /* vanha tarkistus
    if(persons.find(p=>p.name===body.name)){
        return res.status(400).json(
            { error: 'Name must be unique' }
        )
    }
    */

    const person = new Person({
        //tietokanta generoi id:n?
        //id: generateId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

const generateId = () => {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})