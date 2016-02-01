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
  keys: ['key1', 'key2', 'key22']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'abcdef', cookie: { maxAge: 60000 }}))
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res){
  if(req.session.logi==true)
    { res.redirect('/menu');}
  else
    {res.render('login');}
  
}); 
app.post('/logout',function(req,res){
req.session=null;
res.redirect('/');

  });
app.post('/menu',function(req,res){
    req.session.logi=true;
    req.session.password=req.body.password;
    req.session.user=req.body.usuario;
    res.redirect('/menu');
});
app.get('/menu',function(req,res){
  if(req.session.logi==true){
    res.render('a',{u:req.session.user});
    }
  else
    {res.send('err');}
});

app.get('/as',function(req,res){
  console.log(app_user2);
  });
app.get('/ass',function(req,res){
  console.log(app_user);
  });



/*app.get('/ass',function(req,res){
  console.log('-------------------');
  console.log(app_user);
  console.log('-------------------');
for(var socketid in app_user){
var con=0;
         console.log(app_user[socketid]);
         for(var socketid2 in app_user){
          if(app_user[socketid2].user===app_user[socketid].user)
            {
              con++;
            }
          if( con === 1)//{console.log('se encontro 1 vece'+app_user[socketid2].user)}
            if( con === 2){//console.log('se encontro 2 veces'+app_user[socketid2].user);
          app_user2[app_user[socketid2].ide]=app_user[socketid2];}
              //else{console.log('se encontro mas de dos veces'+app_user[socketid2].user)}
          
         //console.log(app_user[socketid2]);

        }
    }
    console.log('-------------------');
  console.log(app_user2);
  console.log('-------------------');
       res.send("ok")
});*/
/*function us(){
for(var socketid in app_user){
var con=0;
         //console.log(app_user[socketid]);
         for(var socketid2 in app_user){
          if(app_user[socketid2].user===app_user[socketid].user)
            {
              con++;
            }
            if( con === 1){
              console.log('agregoa2');
          app_user2[app_user[socketid2].ide]=app_user[socketid2];}
        }
    }
}*/

var app_user2={};
var app_user={};
io.on('connection', function(socket){
	console.log('a user connected');
  
	//io.emit('chat message',''+socket.id);
    	//console.log(socket.id);
	var exten='/#';
  	socket.on('disconnect', function(){
      var idee=socket.id.replace(exten,'');
       delete app_user[idee];
       delete app_user2[idee];
       delete app_user2['ok'];
       console.log('disconnect');
  	});
  	socket.on('chat message', function(msg){
      if(msg.des=='todos'){
        io.emit('chat message', msg.msj);
      }else{
      for(var socketid in app_user){
        if(app_user[socketid].user==msg.des){
          io.to('/#'+app_user[socketid].ide).emit('chat message',msg.msj);
          //if(app_user[socketid].ide!=msg.ide){
          io.to('/#'+msg.ide).emit('chat message',msg.msj);//}
        }
      }
      }
    	//io.emit('chat message', msg);
  	});

    socket.on('acceso',function(user){
    
      
      app_user[user.ide]=user;

      for(var socketid1 in app_user2){
        if(app_user2[socketid1].ide){
      console.log(socket.id);
      io.to(socket.id).emit('agrega', app_user2[socketid1].user);
      }
      }
      var ex=false;
      for(var socketid in app_user2){
        if(app_user2[socketid].user===user.user){ex=true;}
      }
    if(!ex){io.emit('agrega', user.user);}


      if (app_user2.ok===undefined) {
        app_user2.ok='ok';
      app_user2[user.ide]=app_user[user.ide];
      }else{
        var i=false;
        for (var socketid2 in app_user2) {
            if(app_user[user.ide].user==app_user2[socketid2].user)
              {i=true;} 
        }
        if(!i){{app_user2[user.ide]=app_user[user.ide];}}
      }
      
     // console.log(user.no);
      //if(user.no){
      //  user.no=false;
      
     // }else{
      
      //}
      session.ide=user.ide;
    });

    

  
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});