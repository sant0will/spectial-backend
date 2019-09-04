const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const port =  process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./app/controllers/index')(app);


app.listen(port, () => console.log('Server running on 3030 port'));


