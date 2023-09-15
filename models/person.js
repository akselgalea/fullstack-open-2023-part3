const mongoose = require('mongoose')
const url = process.env.MDB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url).then(result => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.log('Error connecting to MongoDB:', error.message);
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => /^\d{2,3}-\d{4,}$/.test(v),
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
