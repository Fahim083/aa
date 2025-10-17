// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Player API is running!");
});

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n5zm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Run MongoDB connection and define routes
async function run() {
  try {
    await client.connect();
    const playerCollection = client.db("playersDB").collection("players");

    // Get all players
    app.get("/players", async (req, res) => {
      const players = await playerCollection.find().toArray();
      res.send(players);
    });

    // Get a single player by ID
    app.get("/players/:id", async (req, res) => {
      const id = req.params.id;
      const player = await playerCollection.findOne({ _id: new ObjectId(id) });
      res.send(player);
    });

    // Add a new player
    app.post("/players", async (req, res) => {
      const newPlayer = req.body;
      const result = await playerCollection.insertOne(newPlayer);
      res.send(result);
    });

    // Update a player by ID
    app.put("/players/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPlayer = req.body;
      delete updatedPlayer._id; // Prevent updating _id

      const result = await playerCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPlayer }
      );
      res.send(result);
    });

    // Delete a player by ID
    app.delete("/players/:id", async (req, res) => {
      const id = req.params.id;
      const result = await playerCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Get players by email (example: "my-players")
    app.get("/my-players/:email", async (req, res) => {
      const email = req.params.email;
      const players = await playerCollection.find({ email }).toArray();
      res.send(players);
    });

    console.log("Connected to MongoDB and routes are ready.");
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Player backend running on port ${port}`);
});
