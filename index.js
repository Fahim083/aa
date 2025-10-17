const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.2n5zm.mongodb.net/playersDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    const playerCollection = client.db("playersDB").collection("players");

    app.get("/players", async (req, res) => {
      const players = await playerCollection.find().toArray();
      res.send(players);
    });
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
