const mongoose = require('mongoose');
// const db = 'mongodb+srv://fr33dom97:13134679@cluster0-yiuli.mongodb.net/Assignment?retryWrites=true&w=majority';

// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch(error => {
//     console.log('Mongoose connetion error: ', error);
//   });

const schema = mongoose.Schema({
  message: { type: String },
  bred_for:{ type: String},
  life_span:{ type: String},
  url:{ type : String},
  temperament:{ type:String},
  pic_url: { type:String}
 
});

const Dog = mongoose.model('Dog', schema, 'dog');

module.exports = Dog;