
require('dotenv').config();
const mongoose = require('mongoose');

const Database = async () => {
try{
    await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true,})
   console.log('connection successfull')
   }catch(e){
       console.log(e)
   }
}

module.exports = Database;


/*require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
    // Database connection 
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true, });
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database connected ');
    }).catch(err => {
        console.log('Connection failed ');
    });
}

// mIAY0a6u1ByJsWWZ

module.exports = connectDB;*/