require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const cors = require('cors');
const authroute = require ('../backend/routes/auth')
const userrouter = require('./routes/user')
// Cors 
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(',') //to handle cors issues 
  
}



app.use(cors(corsOptions))
app.use(express.static('public'));

const Database = require('./config/db');
Database();

app.use(express.json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes 
app.use ('/api/auth', authroute);
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));
app.use('/api/users',userrouter)


app.listen(PORT, console.log(`Listening on port ${PORT}.`));