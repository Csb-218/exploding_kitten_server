const router = require('express').Router();
const client = require('../redis')
const jwt = require('jsonwebtoken');
const { jwtDecode } = require("jwt-decode");
const redis = require('redis')
const generateId = require('../utils/randomIdGenerator')

router.route('/').get(async (req, res) => {

    const schema = {
        '$.name': {
          type: redis.SchemaFieldTypes.TEXT,
          SORTABLE: true,

        },
        '$.email': {
          type:  redis.SchemaFieldTypes.TEXT,

        },
        '$.password': {
          type:  redis.SchemaFieldTypes.TEXT,

        },
        '$.score': {
          type:  redis.SchemaFieldTypes.NUMERIC,
          SORTABLE: true,
        },

       
      };
      
      try {
         await client.ft.create('idx:players', schema, {
          ON: 'JSON',
          PREFIX: 'player:'
        });
        console.log("created")

        
      } catch (e) {
        if (e.message === 'Index already exists') {
          console.log('Index exists already, skipped creation.');
          // const x = await client.ft.dropIndex("idx:players")

          // console.log(x)
        } else {
          // Something went wrong, perhaps RediSearch isn't installed...
          console.error(e);
          process.exit(1);
        }
      }
    // const Ready = await client.get("IAM")
    console.log(client)
   res.send("Hi you are on the player")

})

router.route('/register').post(async(req,res)=>{

    const { name, password, email } = req.body
    console.log(name, password, email)
    const id = generateId(10)

    try{

      const response = await client.ft.search(
        `idx:players`,
        `${password}`,
        `${name}`,
      )

      if(response.total !== 0 ){
        res.status(409).send("user exist")
      }
      else{
        client.json.set(`player:${id}`, '$', {
        "name": name,
        "email": email,
        "password":password,
        "score":0,
        })

        res.status(200).send("User registered")
      }

    }catch(err){
        console.log(err)
       res.status(500).send("Internal server error")
    }
    
})

router.route('/login').post(async(req,res)=>{

  const {password, email } = req.body
  console.log(password, email)
  // const id = generateId(8)

  const response = await client.ft.search(
  `idx:players`,
  `${password}`,
  )

  if(response?.total === 1){

    const account = response?.documents?.find(user => user?.value?.email === email)

    if(account){
      const token = jwt.sign({
      expiresIn: 60 * 60,
      data: {
        id:account?.id?.slice(7),
        name: account?.value?.name,
        email: email,
      },
    }, 'secret')

     res.status(200).json({token:token})
    }
    else{
      res.status(404).send("user not found")
    }
    
  }
  else{
    res.status(404).send("Not found")
  }
  
})

router.route('/:userId').get(async(req,res)=>{

  const { userId } = req?.params
  const { authorization } = req?.headers

  if(authorization){
    const { data } = jwtDecode(authorization);
    const { name, email, id } = data;

    if(id === userId){
      const player = await client.json.get(`player:${id}`)
      res.status(200).json(player)
    }
    else{
      res.status(404).send('incorrect userId')
    }
  }
  else{
    res.status(401).send("unauthorised")
  }



})

router.route('/score/update').post(async(req,res)=>{

  const { authorization } = req?.headers
  const { userId } = req?.params

  if (authorization) {
    const { data } = jwtDecode(authorization);
    const { name, email, id } = data;
    console.log(data,id)

    if(id){
      const { score } = req?.body
      console.log(score)
      
      const player = await client.json.get(`player:${id}`)
      console.log(player)

      // updating score
      player["score"] = player["score"] + Number(score);

      console.log(player)

      const response = await client.json.set(`player:${id}`,'$',player)

      console.log(response)


      res.status(200).send("Score updated")
    }

    else{
      res.status(404).send("Player not found")
    }

  }
  else{
    res.status(401).send("Unauthorised")
  }

})


module.exports = router