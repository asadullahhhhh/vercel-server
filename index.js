const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

  // hobbyDB
  // NYjXAEEJK6PDJEOC
// mongoDB uri.
const uri =
  "mongodb+srv://hobbyDB:NYjXAEEJK6PDJEOC@cluster1.1w25q2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try{
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );

      // mongoDB collections
      const bannerCollection = client.db("hobbyDB").collection("hobbyBanner");
      const groupsCollection = client.db("hobbyDB").collection("groupsDB");

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
    }
    finally{

    }
}

run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.listen(port, () => {
  console.log("Running");
});