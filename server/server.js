const {mongoose}=require("./db/mongoose");
const express=require("express");
const bodyParser=require("body-parser");
const {ObjectID}=require("mongodb");
const _=require('lodash');
const {authenticate}=require("./middleware/authenticate");

const {toDo}=require("./models/todo");
const {User}=require("./models/user");

const port=process.env.PORT||3000;

const app=express();

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{
  var newTodo= new toDo({
    text:req.body.text
  });
  newTodo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get("/todos",(req,res)=>{
  toDo.find().then((docs)=>{
    res.send({docs});
  },(e)=>{
    res.status(400).send(e);
  });
})
app.get("/todos/:id",(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  toDo.findById(id).then((todo)=>{
    if(todo){
      return res.send({todo})
    }
    res.status(404).send({})
  }).catch((e)=>res.status(400).send({}))

});
//delete

app.delete("/todos/:id",(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  toDo.findByIdAndRemove(id).then((result)=>{
    if(!result){
      return res.status(404).send();
    }
    res.send({result})
  }).catch((e)=>res.status(400).send({}))
});

app.patch("/todos/:id",(req,res)=>{
  var id=req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  const body=_.pick(req.body,["text","completed"]);
  if(_.isBoolean(body.completed)&& body.completed){
    body.completedAt= new Date().getTime();
  }
  else{
    body.completedAt=null;
    body.completed=false;
  }
  toDo.findByIdAndUpdate(id,{$set: body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    return res.send({todo})
  }).catch((e)=>res.status(400).send());
});


//create new users
app.post("/users",(req,res)=>{
  var body=_.pick(req.body,["email","password"]);
  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken()
  }).then((token)=>{
    res.header("x-auth",token).send(user);
  }).catch((e)=>res.status(400).send(e));
});
app.listen(port,()=>{
  console.log(`Server started on ${port}`);
});



app.get("/users/me",authenticate,(req,res)=>{
  res.send(req.user);
});

//login route
app.post("/users/login",(req,res)=>{
  var body=_.pick(req.body,["email","password"]);
  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header("x-auth",token).send({user});
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});
module.exports={app}
