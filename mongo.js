const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('parametreja vaaditaan kolme');
    process.exit(1)
}


const pswd = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url = `mongodb+srv://fullstack:${pswd}@cluster0-ugeel.mongodb.net/person-app?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number
})

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('puhelinluettelo:')
        result.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
    })
} else {

    person.save().then(response => {
        console.log('success')
        mongoose.connection.close()
    })
}