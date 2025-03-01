const fs=require('fs');
const path=require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const app = express();
const PORT = 5000;

app.use(bodyParser.json()); //parser the json object into regular js like object,array

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT');
  next();
})
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log(err);
    });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File size too large!" }); // 413: Payload Too Large
  }
  
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error ocurred" });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4ruxd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

