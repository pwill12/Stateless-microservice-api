//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require("express/lib/request");
const res = require("express/lib/response");

const jwt = require('jsonwebtoken')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////Requests Targetting all Articles/////////////////////

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    // console.log(req.body.title)
    // console.log(req.body.content)


    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

// .delete(function(req, res) {

//     Article.deleteMany(function(err) {
//         if (!err) {
//             res.send("Successfully deleted all articles.");
//         } else {
//             res.send(err);
//         }
//     });
// });

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, found) {
        if (!err) {
            res.send(found)
        } else {
            console.log(err)
        }
    })
})

.put(function(req, res) {

    Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully updated the selected article.");
            }
        }
    );
})

.patch(function(req, res) {

    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {

    Article.deleteOne({ title: req.params.articleTitle },
        function(err) {
            if (!err) {
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }
    );
});

// app.post("/news/login", function (req, res) {
//     //our mock user
//     const username = {
//       id: 1,
//       username: "anyuser",
//       email: "anyuser@email.com",
//     };
  
//     jwt.sign({username}, "secretkey", (err, token) => {
//       res.json({
//         token
//       });
//     });
//   });
  
//   //verify function
  
//   // format of token
  
//   //auth method: bearer (access_token)
  
//   function verifyToken(req, res, next) {
//     //get aut-hheader value
//     const bearerHeader = req.headers['auth'];
//     //check bearer is not undefined
//     if (typeof bearerHeader !== "undefined") {
//       //using the split function to turn the string into an array
//       //split the space
//       const bearer = bearerHeader.split(" ")[1];
//       //get token from array
  
//       // const bearertoken = bearer[1];
  
//       //set bearertoken to reqtoken
  
//       req.token = bearer;
  
//       //middleware
  
//       next()
//     } else {
//       //send an error message
//       // res.send("invalid");
//       res.sendStatus(403)
//     }
//   }



app.listen(3000, function() {
    console.log("Server started on port 3000");
});