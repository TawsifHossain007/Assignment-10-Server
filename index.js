const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtqh62q.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }

  //
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("Assignment_10");
    const MovieCollection = db.collection("movies");
    const CollectionCollection = db.collection("collection");

    // Movies
    app.post("/movies", async (req, res) => {
      const newMovie = req.body;
      const result = await MovieCollection.insertOne(newMovie);
      res.send(result);
    });

    app.get("/movies", async (req, res) => {
      const cursor = MovieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/movies/latest", async (req, res) => {
      const cursor = MovieCollection.find();
      const result = await cursor.sort({ _id: -1 }).limit(6).toArray();
      res.send(result);
    });

    app.get("/movies/user", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const query = { addedBy: email };
      const cursor = MovieCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await MovieCollection.findOne(query);
      res.send(result);
    });

    app.patch("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const updatedMovie = req.body;
      const { _id, ...rest } = updatedMovie;
      const query = { _id: new ObjectId(id) };
      const update = { $set: rest };
      const result = await MovieCollection.updateOne(query, update);
      res.send(result);
    });

    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await MovieCollection.deleteOne(query);
      res.send(result);
    });

    // Collection
    app.get("/collection", async (req, res) => {
      const email = req.query.email;
      const query = { user_email: email };

      const cursor = CollectionCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/collection", async (req, res) => {
      const newCollection = req.body;
      const result = await CollectionCollection.insertOne(newCollection);
      res.send(result);
    });

    app.delete("/collection/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CollectionCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
