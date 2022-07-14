//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require('body-parser');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// const testArticle = new Article({
//   title: "Test",
//   content: "Just testing.",
// });
// testArticle.save();



//Requests targeting all articles
app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err){
      console.log(foundArticles);
      res.send(foundArticles);
    }else{
      console.log(err);
      res.send(err);
    }
  });
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully posted an article.");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all records.");
    }else{
      res.send(err);
    }
  });
});


//Requests targeting a specific article
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(!err){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No articles matching that title was found.");
      }
    }else{
      res.send(err);
    }
  });
})

.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    //{overwrite: true},
    function(err, results){
      if(!err){
        //res.send(results);
        res.send("Successfully updated an article.");
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err, results){
      if(!err){
        res.send("Successfully updated the content of article.");
      }else{
        res.send(err);
      }
    }
  );
})

// .delete(function(req, res){
//   Article.findOneAndDelete(
//     req.body,
//     function(err){
//       if(!err){
//         res.send("Sucessfully deleted article.");
//       }
//     }
//   );
// });

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Sucessfully deleted the corresponding article.");
      }else{
        res.send(err);
      }
    }
  );
});












app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
