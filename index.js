const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.Port || 5000;

app.use(cors())
app.use(express.json())
// #2a92fa


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olvofey.mongodb.net/?retryWrites=true&w=majority`;

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
    const taskManagement = client.db("taskManagement");
    const userCollection = taskManagement.collection("taskUsers");
    const taskCollection = taskManagement.collection("tasks");
    
    
//--------------------users--------------------------
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    });
    //feture auto count
  
    app.post('/todo', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

     app.get('/todo/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await taskCollection.find(query).toArray()
      res.send(result)
      console.log(result)
    });
     app.delete('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)
      // console.log(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("task management server is running")
})
app.listen(port, () => {
  console.log(`task management server is running port : ${port}`)
})