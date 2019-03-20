const express = require('express');
const app = express();
const path = require('path');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
app.use(bodyParser.urlencoded({ extended: false }));
const router = express.Router();
//const isbn="";
var mysql = require('mysql');
var con = mysql.createConnection({
  //host: "localhost",
  user: "root",
  password: "password",
  database:"library"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
con.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})
//var express=require('express');
var http=require('http');
//var path=require('path');
//var app=express();
var fs=require('fs');
app.use(express.static('assets'));
app.use('/assets', express.static('assets'));
router.get('/',function(req,res){
var filep=path.join(__dirname+'/files/homepage.html');
console.log(filep);
res.sendFile(filep);
  //__dirname : It will resolve to your project folder.
});

router.get('/booklist.html',function(req,res){
  var filep=path.join(__dirname+'/files/booklist.html');
	console.log(filep);
  res.sendFile(filep);
});
router.get('/checkin.html',function(req,res){
  var filep=path.join(__dirname+'/files/checkin.html');
	console.log(filep);
  res.sendFile(filep);
});


router.get('/homepage.html',function(req,res){
  res.sendFile(path.join(__dirname+'/files/homepage.html'));
});
router.get('/contact.html',function(req,res){
  res.sendFile(path.join(__dirname+'/files/contact.html'));
});
router.get('/user.html',function(req,res){
  res.sendFile(path.join(__dirname+'/files/user.html'));
});
router.get('/fines.html',function(req,res){
  res.sendFile(path.join(__dirname+'/files/fines.html'));
});
//create server http
/*http.createServer(function(req,res){	
if(req.url.match("\img_1.jpg$")){
		var imagepath=path.join(__dirname,'assets',req.url);
		console.log(imagepath);
		var fileStream=fs.createReadStream(imagepath); 
		res.writeHead(200,{"Content-Type":"image/jpeg"});
		fileStream.pipe(res);
	}
	});*/

//add the router
app.use('/', router);
app.listen(process.env.port || 8885);
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/submit-form', function(req, res) {
  const isbn = req.body.isbn;

 
    
    
    var quer='select * from book inner join author on book.isbn=author.isbn and length(name)>0 where title="'+isbn+'" or title like "'+isbn+'%" or title like "%'+isbn+'" or title like "%' +isbn+'%" or name ="'+isbn+'" or name like "' +isbn+'%" or name like "%' +isbn+'" or name like "%'+isbn+'%" or book.isbn="'+isbn+'";';
    console.log(quer);
    con.query('select * from book inner join author on book.isbn=author.isbn and length(name)>0 where title="'+isbn+'" or title like "'+isbn+'%" or title like "%'+isbn+'" or title like "%' +isbn+'%" or name ="'+isbn+'" or name like "' +isbn+'%" or name like "%' +isbn+'" or name like "%'+isbn+'%" or book.isbn="'+isbn+'";',(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    //throw error
  }
  
  var aa="<!DOCTYPE html><html><head><title></title><script><$( document ).ready(function() {$('#btnSubmit').click( function() {$('#formid').click( function(e) {e.preventDefault(); var actionurl = e.currentTarget.action; $.ajax({url: '/submit-form',type: 'post',dataType: 'json',data: $('#formid').serialize(),success: function(data) {debugger;console.log(data);}});$( document ).ready(function() {console.log( 'ready!' );$( '#target' ).submit(function( event ) {alert( 'Handler for .submit() called.' );event.preventDefault();});});</script></head><body><h1>table</h1><table border='1'>";
  
  aa=aa+"<form action='/checkout' method='post' id='formid' name='db>'"
  for(var row in todos){
                aa=aa+"<tr><td><input type='radio' id='select' name='select' value='"+todos[row]['ISBN']+"'></td><p>";
                for(var column in todos[row]){
                	var temp
                	
                	if(todos[row][column]==1)
                	temp="Available";
                	else if(todos[row][column]==0)
                	temp="Unavailable";
                	else
                	temp=todos[row][column];
                   aa=aa+"<td><label>" + temp + "</label></td>";       
                }
                aa=aa+"</tr>";         
            }
            aa=aa+"</table><br/><br/> <input type='text' id='cardid' name='cardid' placeholder='CARD-ID'/><br/><br/><input type='submit' id='btnSubmit'></form></body></html><head></head>";
            res.write(aa);
  
  var abc=todos;
 
  console.log(abc);
  console.log("#####################################################");
  //res.send(todos);
  console.log(todos)
});
    
  
});

app.post('/checkout', function(req, res) {
	const isbn=req.body.select;
	const cardid=req.body.cardid;
	var flag=0;
	var quer='insert into book_loans (isbn, card_id, date_out, due_date) values("'+isbn+'","'+cardid+'",current_date(),current_date+14); update book set bookavail="0" where  ISBN="'+isbn+'";';
    console.log(quer);
    
    
    con.query('insert into book_loans (isbn, card_id, date_out, due_date) values("'+isbn+'","'+cardid+'",current_date(),current_date+14); ',(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    console.log(todos);
     var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Cant insert</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Registration succesful!</h1><form action='/update' method='post'>Confirm:<input type='radio' value='"+isbn+"' name='isbn' id='formid'/><br><br><input type='submit' id='btnSubmit'></form></body></html>";
  }
  res.write(msg);
  });
});

app.post('/user-inf', function(req, res) {
	const isbn=req.body.select;
	const cardid=req.body.cardid;
	var flag=0;
	var quer='select * from book inner join author on book.isbn=author.isbn and length(name)>0 where book.isbn="'+isbn+'";';
    console.log(quer);
    con.query('select * from book inner join author on book.isbn=author.isbn and length(name)>0 where book.isbn="'+isbn+'";',(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    throw error
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Registration succesful!</h1></body></html>";
  }
  res.write(msg);
  
  });
});



app.post('/user-info', function(req, res) {
  const ssn = req.body.ssn;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const phone = req.body.phone;
  

 
    
    var flag=0;
    var quer="insert into borrower (ssn,firstname,lastname,address,city,state,phone) values ('"+ssn+"','"+fname+"','"+lname+"','"+address+"','"+city+"','"+state+"','"+phone+"');";
    console.log(quer);
    con.query("insert into borrower (ssn,firstname,lastname,address,city,state,phone) values ('"+ssn+"','"+fname+"','"+lname+"','"+address+"','"+city+"','"+state+"','"+phone+"');",(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Duplicates! Can register with only one id! Go back and try again</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Registration succesful!</h1></body></html>";
  }
  res.write(msg);
  console.log(todos)
});
    
  
});

app.post('/update', function(req, res) {
  const isbn = req.body.isbn;
  
    
    var flag=0;
    var quer="update book set bookavail='0' where  ISBN='"+isbn+"';";
    console.log(quer);
    con.query("update book set bookavail='0' where  ISBN='"+isbn+"';",(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Registration reverted</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Registration successful!</h1></body></html>";
  }
  res.write(msg);
  console.log(todos);
});
	});

app.post('/checkin', function(req, res) {
  const isbn = req.body.isbn;
  
    
    var flag=0;
    var quer="select loan_id, card_id, firstname, lastname, due_date,date_out,isbn from (select  loan_id,bl.card_id ,firstname,lastname,due_date,date_out,isbn from book_loans as bl inner join borrower as br where bl.card_id=br.card_id) as conso where firstname like '%"+isbn+"%' or firstname like '"+isbn+"%' or firstname like '%"+isbn+"' or lastname like '%"+isbn+"%' or lastname like '%"+isbn+"' or lastname like '"+isbn+"%' or isbn='"+isbn+"' or card_id='"+isbn+"'; ";
    console.log(quer);
    con.query("select loan_id, card_id, firstname, lastname, due_date,date_out,isbn from (select  loan_id,bl.card_id ,firstname,lastname,due_date,date_out,isbn from book_loans as bl inner join borrower as br where bl.card_id=br.card_id) as conso where firstname like '%"+isbn+"%' or firstname like '"+isbn+"%' or firstname like '%"+isbn+"' or lastname like '%"+isbn+"%' or lastname like '%"+isbn+"' or lastname like '"+isbn+"%' or isbn='"+isbn+"' or card_id='"+isbn+"'and date_in<=current_date(); ",(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Checkin Failed</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  var aa="<!DOCTYPE html><html><head><title></title><script><$( document ).ready(function() {$('#btnSubmit').click( function() {$('#formid').click( function(e) {e.preventDefault(); var actionurl = e.currentTarget.action; $.ajax({url: '/submit-form',type: 'post',dataType: 'json',data: $('#formid').serialize(),success: function(data) {debugger;console.log(data);}});$( document ).ready(function() {console.log( 'ready!' );$( '#target' ).submit(function( event ) {alert( 'Handler for .submit() called.' );event.preventDefault();});});</script></head><body><h1>table</h1><table border='1'><tr><th>Check</th><th>Loan id</th><th>Card id</th><th>First Name</th><th>Last Name</th><th>Issue Date</th><th>Due Date</th><th>ISBN of the book issued</th></tr>";
  
  aa=aa+"<form action='/delete' method='post' id='formid' name='db>'"
  for(var row in todos){
                aa=aa+"<tr><td><input type='radio' id='select' name='isbn' value='"+todos[row]['isbn']+"'></td><p>";
                for(var column in todos[row]){
                	var temp
                	
                	temp=todos[row][column];
                   aa=aa+"<td><label>" + temp + "</label></td>";       
                }
                aa=aa+"</tr>";         
            }
            aa=aa+"</table><br/><br/><input type='submit' id='btnSubmit'></form></body></html><head></head>";
            res.write(aa);
  
  var abc=todos;
 
  console.log(abc);
});
    
  
});

app.post('/delete', function(req, res) {
  const isbn = req.body.isbn;
  
    
    var flag=0;
    var quer="update book_loans set date_in=current_date() where ISBN='"+isbn+"';";
    console.log(quer);
    con.query("update book_loans set date_in=current_date() where  ISBN='"+isbn+"';",(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Checkin failed</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Checkin succesful!</h1><form action='/bookdelete' method='post'>Confirm:<input type='radio' value='"+isbn+"' name='isbn' id='formid'/><br><br><input type='submit' id='btnSubmit'></form></body></html>"
  }
  res.write(msg);
  console.log(todos);
});
	});
	app.post('/bookdelete', function(req, res) {
  const isbn = req.body.isbn;
  
    
    var flag=0;
    var quer="update book set bookavail='1' where ISBN='"+isbn+"';";
    console.log(quer);
    con.query("update book set bookavail='1' where  ISBN='"+isbn+"';",(error, todos, fields) => {
  if (error) {
    console.error('An error occurred while executing the query')
    var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Checkin failed</h1></body></html>";
     flag=1;
    res.write(msg);
  }
  if(flag==0)
  {
  	var msg="<!DOCTYPE html><html><head><title></title></head><body><h1>Checkin succesful! Book available</h1><form action='/delete book' method='post'>Confirm:<input type='radio' value='"+isbn+"' name='isbn' id='formid'/><br><br><input type='submit' id='btnSubmit'></form></body></html>"
  }
  res.write(msg);
  console.log(todos);
});
	});
	
	
	
app.post('/fines', function(req, res) {
  	const isbn = req.body.isbn;
  	const cardid = req.body.cardid; 
    var quer="select loan_id, card_id, firstname, lastname, due_date,date_out,isbn from (select  loan_id,bl.card_id ,firstname,lastname,due_date,date_out,isbn from book_loans as bl inner join borrower as br where bl.card_id=br.card_id) as conso where firstname like '%"+isbn+"%' or firstname like '"+isbn+"%' or firstname like '%"+isbn+"' or lastname like '%"+isbn+"%' or lastname like '%"+isbn+"' or lastname like '"+isbn+"%' or isbn='"+isbn+"' or card_id='"+isbn+"'and date_in<=current_date(); ";
    console.log(quer);
    con.query("select loan_id, card_id, firstname, lastname, due_date,date_out,isbn from (select  loan_id,bl.card_id ,firstname,lastname,due_date,date_out,isbn from book_loans as bl inner join borrower as br where bl.card_id=br.card_id) as conso where firstname like '%"+isbn+"%' or firstname like '"+isbn+"%' or firstname like '%"+isbn+"' or lastname like '%"+isbn+"%' or lastname like '%"+isbn+"' or lastname like '"+isbn+"%' or isbn='"+isbn+"' or card_id='"+isbn+"'; ",(error, todos, fields) => {
  	if (error) {
    console.error('An error occurred while executing the query')
    //throw error
  	}
  var aa="<!DOCTYPE html><html><head><title></title><script><$( document ).ready(function() {$('#btnSubmit').click( function() {$('#formid').click( function(e) {e.preventDefault(); var actionurl = e.currentTarget.action; $.ajax({url: '/submit-form',type: 'post',dataType: 'json',data: $('#formid').serialize(),success: function(data) {debugger;console.log(data);}});$( document ).ready(function() {console.log( 'ready!' );$( '#target' ).submit(function( event ) {alert( 'Handler for .submit() called.' );event.preventDefault();});});</script></head><body><h1>Select to calculate</h1><table border='1'><tr><th>Check</th><th>Loan id</th><th>Card id</th><th>First Name</th><th>Last Name</th><th>Issue Date</th><th>Due Date</th><th>ISBN of the book issued</th></tr>";
  
  aa=aa+"<form action='/calculate' method='post' id='formid' name='db>'"
  for(var row in todos){
                aa=aa+"<tr><td><input type='radio' id='select' name='cardid' value='"+todos[row]['card_id']+"'></td><p>";
                for(var column in todos[row]){
                	var temp
                	
                	temp=todos[row][column];
                   aa=aa+"<td><label>" + temp + "</label></td>";       
                }
                aa=aa+"</tr>";         
            }
            aa=aa+"</table><br/><br/><input type='submit' id='btnSubmit'></form></body></html><head></head>";
            res.write(aa);
  
  var abc=todos;
 
  console.log(abc);
});
    
  
});	
	
app.post('/calculate', function(req, res) {
  	
  	const cardid = req.body.cardid; 
    var quer='select * from borrower where card_id="'+cardid+'";';
    console.log(quer);
    con.query('select * from borrower where card_id="'+cardid+'";',(error, todos, fields) => {
  	if (error) {
    console.error('An error occurred while executing the query')
    throw error
  	}
  //res.send('You sent the name "' + req.body.cardid + '".');
  var abc=todos;
  console.log(abc);
  res.send(todos)
  console.log(todos)
});
    
  
});
app.post('/userfind', function(req, res) {
  	
  	const cardid = req.body.cardid; 
    var quer='select * from borrower where card_id="'+cardid+'";';
    console.log(quer);
    con.query('select * from borrower where card_id="'+cardid+'";',(error, todos, fields) => {
  	if (error) {
    console.error('An error occurred while executing the query')
    throw error
  	}
  //res.send('You sent the name "' + req.body.cardid + '".');
  var abc=todos;
  console.log(abc);
  res.send(todos)
  console.log(todos)
});
    
  
});





console.log('Running at Port 8885');
