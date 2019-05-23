const express = require('express')
const app = express()

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//add that damn zero
const pad = (n) => {
    return n < 10 ? '0' + n : n
}

//date obj
var d = new Date();
const tzOffset = () => {
    var tz = d.getTimezoneOffset();
    var sign = tz > 0 ? "-" : "+";
    var hours = pad(Math.floor(Math.abs(tz) / 60));
    var minutes = pad(Math.abs(tz) % 60);
    return (
        sign + hours + ":" + minutes
    )
}

app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p> ${d.toUTCString()} ${tzOffset()} </p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(p => p.id === id)
    if (person.length===1) {
        res.json(person)
    }else{
        res.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})