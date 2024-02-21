const express = require('express'); 
require('dotenv').config();
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 3000;

//Connecting to server
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.listen(port, () => {
    console.log(`server listening on ${port}`); 
});

//Home
app.get('/', (req, res) => {
    res.send('hello world')
})


const leaderBoardRouter = require('./routers/leaderBoard')
const playerRouter = require('./routers/player')
const cardsRouter = require('./routers/cards')
// // routers
app.use('/leaderBoard',leaderBoardRouter)
app.use('/player',playerRouter)
app.use('/cards',cardsRouter)

