const express = require('express');
const app = express();
const db = require('./database');
const cors = require('cors');
const bodyParser = require('body-parser');

const corsOptions = {
    origin: '',
    optionsSuccessStatus: 200
};

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/leaderboard', (req, res) => {
    db('scores').select('*').orderBy('score', 'desc').then(scores => {
        console.log(scores);
        res.json(scores);
    });
});

app.get('/leaderboard/:difficulty', (req, res) => {
    let difficulty = req.params.difficulty;
    db('scores').select('*').where({difficulty}).orderBy('score', 'desc').then(scores => {
        console.log(scores);
        res.json(scores);
    });
});

app.post('/leaderboard', (req, res) => {
    db('scores').insert(req.body).then(result => {
        console.log(result);
        res.json({status: 'success'});
    });
});

const port = process.env.PORT || 3010;
const ip = process.env.IP;
app.listen(port, ip, function(){
    console.log('Listening on port '+port);
});