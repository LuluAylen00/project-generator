const express = require('express');
const app = express();
const config = require('dotenv').config;
config();

const port = process.env.PORT || 3418;
app.listen(port, () => {
    console.log("Escuchando en puerto "+port);
});

// EJS

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const static = express.static("public");
app.use(static);

const mainRouter = require('./routes/main-router');
app.use(mainRouter);
