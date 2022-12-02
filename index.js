import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    hello: "hi",
  });
});

app.listen("3000", () => {
  console.log("SERVER IS LISTENING ON PORT 3000");
});
