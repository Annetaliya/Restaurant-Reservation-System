const express = require('express');
const app = express();
const PATH = 8000;
const userRoutes = require('./Routes/userRoutes.js')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/users', userRoutes);



app.listen(PATH , () => {console.log(`app is listening on port ${PATH}`)})