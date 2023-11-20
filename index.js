const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())


console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);



const { MongoClient, ServerApiVersion } = require('mongodb');
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


    app.get('/menu' , async(req , res)=>{
        try {
            const result = await menuCollectyion.find().toArray();
            res.send(result)
        } catch (error) {
            console.log(error);
        }

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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