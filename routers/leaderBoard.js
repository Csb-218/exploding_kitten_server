const router = require('express').Router();
const client = require('../redis')

router.route('/').get(async (req, res) => {

   const players = await client.ft.search("idx:players",'*',{SORTBY:"$.score",DESC:true})
   const leaderboard = players?.documents?.reverse()
   console.log(leaderboard)
   res.status(200).json(leaderboard)
})

module.exports = router