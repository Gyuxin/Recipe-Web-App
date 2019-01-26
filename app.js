var express = require('express');
var app = express();
var mongo= require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var DBURL="mongodb://localhost:27017/recipeDB";     //R3.1

var list={names:[]};

app.set('views','./views');
app.set('view engine','pug');

//logger
app.use(function(req,res,next){
	console.log(req.method+" request for "+req.url);
	next();
});

//display main inventory sheet overview
app.get(['/', '/index.html', '/home', '/index'],function(req,res){         //R1.1
				res.render('index',{});
});

app.get("/recipes",function(req,res){                      //R1.2
	mongo.connect(DBURL,function(err,db){
	    var cursor = db.collection("recipes").find({},{name:1,_id:0});
			var arr = [];
        cursor.each(function(err,document){
			if(document!=null){
			arr.push(document.name);
			list.names = arr;
			}
			if(document == null){
					res.send(list);
				db.close();
			}
        });
		});
		});


app.get("/recipe/*",function(req,res){              //R1.3
	var cursor;
	mongo.connect(DBURL,function(err,db){
		if(err){
			res.sendStatus(404);                          //R1.4
		}
		else{
   db.collection("recipes").findOne({name:req.url.slice(8,req.url.indexOf("?")).replace(/%20/g," ")})
   .then(function(cursor){
		console.log(cursor);
		res.send(cursor);
		 });
	 }
});
});

app.use('/recipe',bodyParser.urlencoded({extended:true}));   //R1.5
//app.use('/recipe',bodyParser.json());
app.post("/recipe",function(req,res){

	mongo.connect(DBURL,function(err,db){
		if(err){
			res.sendStatus(500);
		}
		else if(req.body.name.length===0){                      //R1.6
			res.sendStatus(400);
		}
		else{
			console.log("POST SUCCESS");
			if(list.names.indexOf(req.body.name)<0){              //R1.7
				db.collection("recipes").insert(req.body);   //do not have it in the list
			}
			else{
			console.log(req.body);
			db.collection("recipes").update(
				{name:req.body.name},
				{
					name:req.body.name,
				  duration:req.body.duration,
					ingredients:req.body.ingredients,
					directions:req.body.directions,
					notes:req.body.notes
			  }
			);
		}
					res.sendStatus(200);
	}
	});
});



//static server for non-pug files
app.use(express.static("./public"));                     //R1.1
app.listen(2406,function(){console.log("Server listening on port 2406");});
