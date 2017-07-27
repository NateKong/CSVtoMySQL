var table = 'groupParks';

function getKeys(objects){
    var keys = [];
    for (var a in objects){
        keys.push(a);
    }
    return keys;
}

function insertIntoMysql(json){
	//mysql driver
	var mysql = require('mysql');
	console.log("mysql driver created");
	
	//connection
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "nate",
	  database: "park"
	});
	console.log("connection created");

	//connect to MySQL and query
	con.connect(function(err) {
	  if (err){
	   console.log("function can't connect");
	   throw err;
	  }
	  console.log("Connected!" + "\n");

	  //find number of key/values
	  var numOfCols = Object.keys(json[0]).length;
	  var keys = getKeys(json[0]);

	  var z = 1;
	  //for each object find values and query
      for(var i in json){
      	//query statement
	    var sql = "INSERT INTO " + table + " VALUES(";
        for(var j=0; j<numOfCols-1; j++){
          sql += "'" + json[i][keys[j]]+"',";
        }
        sql+= "'" + json[i][keys[numOfCols-1]];
        sql += "');";
		
		console.log(sql);

		//send query
	    con.query(sql, function (err, result) {
	      if (err) throw err;
	      console.log(z++ + " - record has been inserted");
	    });
		
      }
	});

}

//require the csvtojson converter class 
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});
// call the fromFile function which takes in the path to your 
// csv file as well as a callback function
converter.fromFile("parks.csv",function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An Error Has Occured");
        console.log(err);  
    } 
    
    // log our json to verify it has worked
    console.log("converted to json\nResult:");
    console.log(result);
    console.log();
    insertIntoMysql(result);
});

