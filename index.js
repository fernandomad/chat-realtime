var express = require('express');
var app = express();
var jade = require('jade');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser     =  require('body-parser');
var session = require('express-session')
var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'abcdef', cookie: { maxAge: 60000 }}))

//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res){
  if(req.session.logi==true)
    { res.redirect('/menu');
      //res.render('a',{u:req.session.user});
    }
  else
    {res.render('login');}
  
}); 
app.post('/logout',function(req,res){
req.session=null;
res.redirect('/');

  });
app.post('/menu',function(req,res){

  
  
    req.session.logi=true;
    req.session.ide=req.body.password;
    req.session.user=req.body.usuario;
    res.redirect('/menu');
  

  
});
app.get('/menu',function(req,res){
  if(req.session.logi==true){
  res.render('a',{u:req.session.user});}
  else
    {res.send('err');}
});
app.get('/ass',function(req,res){
for(var socketid in app_user){
         console.log(app_user[socketid]);
       }
       res.send("ok")
});


var app_user={};
io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('chat message',''+socket.id);
    	//console.log(socket.id);
	var exten='/#';
  	socket.on('disconnect', function(){
      var idee=socket.id.replace(exten,'');
      console.log('-----------------');
      console.log(app_user[idee]);
       delete app_user[idee];
       console.log('-----------------');
      console.log(app_user[socket.id]);
    	console.log('user disconnected');
    	
  	});
  	socket.on('chat message', function(msg){
      
       

      for(var socketid in app_user){
         //console.log(app_user[socketid].ide);
        
        if(app_user[socketid].user=='ref'){
         // console.log('entro');
          io.to('/#'+app_user[socketid].ide).emit('chat message',msg);
        }
      }
    	//io.emit('chat message', msg);
  	});

    socket.on('acceso',function(user){
      
      
      app_user[user.ide]=user;


    });

    

  
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});