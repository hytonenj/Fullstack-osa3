require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

mongoose.set('useFindAndModify', false)

morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :response-time ms - :body'))



app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people.map(p => p.toJSON()))
    })
        .catch(error => next(error))
})


// info
app.get('/info', (req, res) => {
    Person.countDocuments()
        .then(response => {
            res.send(`<p>Puhelinluettelossa ${response} henkilön tiedot</p>
            <p> ${Date()} </p>`)
        })
})

// valitun hakeminen
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        }).catch(error => next(error))
})

// valitun poisto
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(res.status(204).end())
        .catch(error => next(error))
})

//lisääminen
app.post('/api/persons', (req, res, next) => {
    const body = req.body


    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({
            error: 'You must enter name and number'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
        .catch(error => next(error))

})

//päivittäminen
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

//////////////////////////////error stuff///////////////////////////////////////////
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

})