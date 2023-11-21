const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xm8ksdz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollectyion = client.db("bistroDb").collection("menu");
    const usersCollectyion = client.db("bistroDb").collection("users");
    const reviwesCollectyion = client.db("bistroDb").collection("reviews");
    const cartCollectyion = client.db("bistroDb").collection("carts");

    // / **** Get Operation Start ****************

    app.get('/menu' , async(req , res)=>{
        try {
            const result = await menuCollectyion.find().toArray();
            res.send(result)
        } catch (error) {
            console.log(error);}})

    app.get('/reviews' , async(req , res)=>{
        try {
            const result = await reviwesCollectyion.find().toArray();
            res.send(result)
        } catch (error) {console.log(error);}})

    app.get('/cart', async(req,res)=>{
        try {
            const email = req.query.email;
            // console.log(email);
            const query = {email : email};
            // console.log(query);
          
            const result =await cartCollectyion.find(query).toArray();
            res.send(result)
        } catch (error) { console.log(error); }})

        app.get('/users',async(req,res)=>{
            try {
                const result = await usersCollectyion.find().toArray()
                res.send(result)
                
            } catch (error) {
                console.log(error);
            }
        })

    // / **** Get Operation End ****************


    // / **** Delete Operation Start ****************

app.post('/cart', async(req , res)=>{
   try {
    const cartItem = req.body;
    const result = await cartCollectyion.insertOne(cartItem)
    res.send(result)
   } catch (error) {
    console.log(error);
   }})
   

   app.post('/users', async(req,res)=>{
try {
    const user = req.body;
    const query = {email : user.email}
    const existingUser = await usersCollectyion.findOne(query)
    if (existingUser) {
        return res.send('User Already Exist')
    }
    const result = await usersCollectyion.insertOne(user)
    res.send(result)
} catch (error) {
   console.log(error); 
}
   })
// /****** Post Operation End ****************

 // / **** Delete Operation Start ****************
   app.delete('/cart/:_id' , async(req,res)=>{
  try {
    const id = req.params._id;
    // console.log(id);
    const query = {_id: new ObjectId(id)}
    // console.log(query);
    const result = await cartCollectyion.deleteOne(query)
    res.send(result)
  } catch (error) {
    console.log(error);
  }

   })


// / **** Delete Operation Start ****************
     



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    try {
        res.send('Bostro Boss Is Running')
    } catch (error) {
        console.log(error);
    }
 
})




app.listen(port, () => {
  console.log(`Bistro Boss Server is Running On: ${port}`)
})