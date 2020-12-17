const express = require('express');
const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended : false}));

//routes 
app.use(require('./routes/index'));

app.listen(3000);
console.log('Server on port 3000');

//referencia de como hacer una api rest: https://www.youtube.com/watch?v=7NfvC-gOcRc&t=907s