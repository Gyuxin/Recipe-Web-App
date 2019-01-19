/*
Author: Yuxin Gao
Student Number: 101016814
*/

var http = require('http');
var fs = require('fs');
var mime = require ('mime-types');
var url = require ('url');
const ROOT = "./public_html";

//create http server
var server = http.createServer(handleRequest);
server.listen(2406);
//Create array of file names that under recipes dictionary
var array = fs.readdirSync(ROOT+"/recipes",'utf8');
console.log('Server listening on port 2406');

function handleRequest(req,res){

	//process the request
	console.log(req.method+"request for: "+req.url);
	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;

	if(urlObj.pathname==="/recipes"){
		var parse_data = {filename:[],jsonfile:[]}
		var name_array = []
		for(var i=1;i<array.length;i++){
			var data=fs.readFileSync(ROOT+"/recipes/"+array[i], 'utf8');
			name_array.push(JSON.parse(data));
		}
		parse_data.jsonfile = name_array;
		parse_data.filename = array;
	  respond(200,JSON.stringify(parse_data));
	}else if(req.method==="POST"){//this post request(from line 33-42) is cited from course code
		var postBody="";

		req.setEncoding('utf8');
		req.on('data',function(chunk){
		    postBody+=chunk; //data is read as buffer objects
		});

		req.on('end', function() {
		fs.writeFileSync(filename, postBody);
		});

	}else if(urlObj.pathname==="/recipes/"){
		json_file_name = urlObj.search.substr(8);
		var data=fs.readFileSync(ROOT+"/recipes/"+json_file_name, 'utf8');
		respond(200,data);
	}else{
		fs.stat(filename,function(err,stats){
		if(err){
			respondErr(err)
		}else if(stats.isDirectory()){
			fs.readdir(filename,function(err,files){
				if(err)respondErr(err);
				else respond(200,files.join("<br/>"));
			});
		}else{
			fs.readFile(filename,"utf8",function(err,data){
				if(err)respondErr(err);
				else respond(200,data);
			});
		}
	});
	}

	//locally defined helper function
	//serves 404 files
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}

	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}

	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}
};//end handle request
