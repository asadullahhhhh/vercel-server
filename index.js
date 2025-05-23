const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// mongoDB uri.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.1w25q2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // mongoDB collections
    const bannerCollection = client.db("hobbyDB").collection("hobbyBanner");
    const groupsCollection = client.db("hobbyDB").collection("groupsDB");
    const usersCollections = client.db("hobbyDB").collection("userDB");

    app.get("/", (req, res) => {
      res.send("Server running successfully");
    });

    app.get("/banners", async (req, res) => {
      const cursor = bannerCollection.find();
      const banners = await cursor.toArray();
      res.send(banners);
    });

    app.get("/groups", async (req, res) => {
      const pointer = groupsCollection.find();
      const groupData = await pointer.toArray();
      res.send(groupData);
    });

    app.get("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupsCollection.findOne(query);
      res.send(result);
    });

    app.post("/groups", async (req, res) => {
      const data = req.body;
      const result = await groupsCollection.insertOne(data);
      res.send(result);
    });

    app.put("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateData = req.body;
      const updateDocs = {
        $set: updateData,
      };

      const result = await groupsCollection.updateOne(query, updateDocs);
      res.send(result);
    });

    //   users collection
    app.get("/users", async (req, res) => {
      const pointer = usersCollections.find();
      const usersData = await pointer.toArray();
      res.send(usersData);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userData = req.body;
      const result = await usersCollections.insertOne(userData);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateData = req.body;
      const updateDocs = {
        $set: updateData,
      };

      const result = await usersCollections.updateOne(query, updateDocs);
      res.send(result);
    });

    // group delete method 
    app.delete("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groupsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log("Running");
});
