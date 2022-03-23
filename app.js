//jshint esversion:6

const express = require("express"); //using express framework for our server-side

const bodyParser = require("body-parser"); //using body parser for our post request

const ejs = require("ejs"); //using an html template for rendering post on our frontend

const mongoose = require("mongoose"); //using mongoose npm package for our database

const req = require("express/lib/request");
const res = require("express/lib/response");

const jwt = require("jsonwebtoken"); //using jwt library for authorization

const jimp = require("jimp"); //using jimp for resizing our thumbnail url requests

const app = express(); //initializing our express module

app.set("view engine", "ejs"); //initializing our ejs module

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); //initializing our body-parser

app.use(express.static("public")); //accessing stating files

///////////Setting up our database/////////////////

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true }); //using the mongoose module

const articleSchema = {
  title: String,
  content: String,
}; //creating our schema for our database

const Article = mongoose.model("Article", articleSchema); //creating our collection for storing our database

///////////////Requests Targetting all Articles/////////////////////

app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err); //sending an err msg if failed
      }
    });
  })

  //targeting our post route and also authorizing the user with jwt

  .post(verifyToken, (req, res) => {
    // console.log(req.body.title)
    // console.log(req.body.content)

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    jwt.verify(req.token, "secretkey", (err, authuserdata) => {
      if (!err) {
        res.json({
          Title: req.body.title,
          Content: req.body.content,
          authuserdata,
        });
      } else {
        res.sendStatus(403);
      }
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  });

app
  .post("/articles/login", function (req, res) {
    //our mock user
    const username = {
      id: 1,
      username: "anyuser",
      email: "anyuser@email.com",
    };

    jwt.sign({ username }, "secretkey", (err, token) => {
      res.json({
        token,
      });
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////Requests Targetting A Specific Article/////////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (err, found) {
      if (!err) {
        res.send(found);
      } else {
        res.sendStatus(403);
      }
    });
  })


  ////updating the json file with a new file/////

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        } else {
          res.sendStatus(403);
        }
      }
    );
  })

  /////updating a specific element in the json file///
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    });
  });


  /////verify token function/////
function verifyToken(req, res, next) {

  //get auth-hheader value
  const bearerHeader = req.headers["auth"];

  ///Using jwt documentation//////

  //check if typeofbearer is not undefined
  if (typeof bearerHeader !== "undefined") {
    //using the split function to turn the string into an array

    //split the space
    const bearer = bearerHeader.split(" ")[1];

    //get token from array

    // const bearertoken = bearer[1];

    //set bearertoken to reqtoken

    req.token = bearer;

    //middleware

    next();
  } else {
    //send an error message
    // res.send("invalid");
    res.sendStatus(403);
  }
}

app.post("/articles/thumbnail", function (req, res) {
  const imgurl = req.body.url;

  jimp.read(imgurl, function (err, imgresize) {
    if (err) {
      res.sendStatus(403);
    } else {
      imgresize.resize(50, 50).getBase64(jimp.AUTO, function (err, img100) {
        if (err) {
          res.sendStatus(403);
        } else {
          // res.sendStatus(200)
          res.send('<img src="' + img100 + '">');
        }
      });
    }
  });
});

module.exports = app.listen(3000, function () {
  console.log("Server started on port 3000");
});
