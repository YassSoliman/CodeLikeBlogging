var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	http = require('http').Server(app),
	methodOverride = require('method-override');

// App config
mongoose.connect('mongodb://localhost:27017/codelike_blog', { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose/model confi
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Restful routes

app.get("/", function(req, res){
	res.redirect("/blog");
});
// INDEX Route
app.get("/blog", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW Route
app.get("/blog/new", function(req, res){
	res.render("new");
});

// CREATE route
app.post("/blog", function(req, res){
	// Create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blog");
		}
	})
});

// SHOW Route
app.get("/blog/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blog");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
});
// EDIT Route
app.get("/blog/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {
				blog: foundBlog
			});
		}
	});
});

// UPDATE Route
app.put("/blog/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blog");
		}else{
			res.redirect("/blog/"+req.params.id);
		}
	});
});

http.listen(3000, function(){
	console.log("Server started on *:3000");
});
