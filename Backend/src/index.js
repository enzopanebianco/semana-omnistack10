const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const {setupWebSocket}  =require('./websocket')
const app = express();
const server = http.Server(app);
setupWebSocket(server);
mongoose.connect('mongodb+srv://enzo:omnistack@cluster0-bo5uh.mongodb.net/omnistack?retryWrites=true&w=majority',{useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());


require('./controllers/index')(app);

server.listen(3333);