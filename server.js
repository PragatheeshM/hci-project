const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

const uri =
  "mongodb+srv://pragatheesh:mp292003@cluster0.ejcve69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

app.use(express.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

app.get("/api/movies", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("hci-proj");
    const collection = database.collection("hci");
    const movies = await collection.find({}).toArray();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  } finally {
    await client.close();
  }
});

// Update movie status
app.post("/api/movies/:id/update", async (req, res) => {
  const movieId = req.params.id;
  const { liked, bookmarked, watchlist } = req.body;

  try {
    await client.connect();
    const database = client.db("hci-proj");
    const collection = database.collection("hci");

    // Update the movie based on the ID
    const result = await collection.updateOne(
      { id: parseInt(movieId) },
      { $set: { liked, bookmarked, watchlist } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send("Movie updated successfully");
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).send("Error updating movie");
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
