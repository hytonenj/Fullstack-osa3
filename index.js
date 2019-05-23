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

app.get('/api/persons', (req, res) =>{
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    
})