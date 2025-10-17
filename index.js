// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n5zm.mongodb.net/playersDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("MongoDB connected");

    const Tournament = client.db("Tournament").collection("players");

    // Root route
    app.get("/", (req, res) => {
      res.send("Welcome to the Players API!");
    });

    // Get all players
    app.get("/players", async (req, res) => {
      const players = await playerCollection.find().toArray();
      res.send(players);
    });

    // Get a player by ID
    app.get("/players/:id", async (req, res) => {
      const id = req.params.id;
      const player = await playerCollection.findOne({ _id: new ObjectId(id) });
      res.send(player);
    });

    // Get players by email
    app.get("/my-players/:email", async (req, res) => {
      const email = req.params.email;
      const players = await playerCollection.find({ email }).toArray();
      res.send(players);
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
      delete updatedPlayer._id; // prevent _id update error

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

    // Start the server after MongoDB connects
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
