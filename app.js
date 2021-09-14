const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const wikiSchema = new mongoose.Schema({
    title : String,
    content : String 
});
const article =  mongoose.model("article" , wikiSchema);

app.get("/articles" , function(req , res){
    article.find(function(err , foundArticle){
        if(!err){
        res.send(foundArticle);
        }else{
            console.log(err);
        }
    })
})

app.post("/articles" , function(req,res){
    console.log(req.body.title)
    console.log(req.body.content)

    const newArticle = new article({
        title : req.body.title ,
        content : req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("added succesfully");
        }else{
            res.send(err)
        };
    });
});

app.delete("/articles" , function(req, res){
    article.deleteMany(function(err){
        if(!err){
            res.send("deleted")
        }else{
            res.send(err)
        }
    })
})

/////////////////////////////////////////////////////Requests for specific article/////////////////////////////////////////////////////////



app.route("/articles/:articleTitle")
    .get(function(req , res){
       article.findOne({title :  req.params.articleTitle} , function(err , foundArticle){
           if(foundArticle){
               res.send(foundArticle)
           }else{
               res.send("No article found")
           };
       }) 
    })

    .put(function (req, res) {
		article.findOneAndUpdate({ title: req.params.title },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (err) {
					res.send(err);
				}
				else {
					res.send("Successfully Updated");
				}
			})
	})

    .patch(function (req, res) {
		article.updateOne(
			{ title: req.params.articleTitle },
			{ $set: req.body },
			function (err) {
				if (err) {
					res.send(err)
				}
				else {
					res.send("Successfully Updated.")
				}
			})
	})

    .delete(function(req , res){
        article.findOneAndDelete({title :req.params.articleTitle} , function(err){
            if(!err){
                res.send("deleted");
            }else{
                res.send("not deleted");
                console.log(err)
            };
        })
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });