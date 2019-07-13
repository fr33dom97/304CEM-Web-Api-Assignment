const mongoose = require('mongoose');
const db = 'mongodb+srv://fr33dom97:13134679@cluster0-yiuli.mongodb.net/Assignment?retryWrites=true&w=majority';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  username: { type: String },
  password: {type: String},
  user_position: {type: String}
 
});

const login = mongoose.model('Login', schema, 'login');

module.exports = login;