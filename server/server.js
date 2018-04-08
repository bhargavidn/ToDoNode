const {mongoose}=require("./db/mongoose");
const express=require("express");
const bodyParser=require("body-parser");
const {ObjectID}=require("mongodb");

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
app.listen(port,()=>{
  console.log(`Server started on ${port}`);
});

module.exports={app}
