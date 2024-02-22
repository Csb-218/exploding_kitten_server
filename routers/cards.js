const router = require('express').Router();
const shuffle = require('../utils/shuffle')
const random  =require('../utils/randomNumber')

router.route('/').get(async(req,res)=>{

    const cards = ['shuffle','bomb','defuse','cat']

    let shuffledCards = []

    for(i=0;i<5;i++){
        const randomCard = random(4)
        shuffledCards.unshift(cards[randomCard])
    }

    res.status(200).json({cards:shuffledCards})

})

router.route('/:count').get(async(req,res)=>{
    
    const { count } = req?.params

    const cards = ['shuffle','bomb','defuse','cat']

    let shuffledCards = [];

    for(i=0;i<count;i++){
        const randomCard = random(4)
        shuffledCards.unshift(cards[randomCard])
    }

    res.status(200).json({cards:shuffledCards})

})


module.exports = router