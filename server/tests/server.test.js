const expect=require("expect");
const request=require("supertest");
const {ObjectID}=require("mongodb");

const {app}=require("./../server");
const {toDo}=require("./../models/todo");


const Todos=[{
  _id:new ObjectID(),
  text:"Eating"
},{
  _id:new ObjectID(),
  text:"Studying",
  completed:true,
  completedAt:23222
}];
beforeEach((done)=>{
  toDo.remove({}).then(()=>{
  toDo.insertMany(Todos);
  }).then(()=>done()).catch(done);
});
describe("POST /todos",()=>{

  it("should create a new todo",(done)=>{
    // a new todo to be created
    var text="Test a todo text";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        toDo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      });
  });

  //for bad data
  it("should not create a todo with bad data",(done)=>{
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        toDo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });
});

describe("GET /todos",function(){

  it("should return todos",(done)=>{
    request('app')
      .get("/todos")
      .expect(200)
      .expect((res)=>{
        expect(res.body.docs.length).toBe(2);
      }).end(done);
  });
})
describe("GET /todos/id",function(){
  it("should return a todo",(done)=>{
    request(app)
      .get(`/todos/${Todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(Todos[0].text);
        //console.log("result is "+(res.body.todo.text,undefined,2));
      })
      .end(done);
  });

  it("should return 404 of todo not found",(done)=>{
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  });
  it("should return 404 for non-object ids",(done)=>{
    request(app)
      .get("/todos/123")
      .expect(404)
      .end(done)
  })
});

describe("DELETE /todos/id",()=>{
  it("should remove a todo",(done)=>{
    var hexId=Todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.result._id).toBe(hexId)
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      toDo.findById(hexId).then((todo)=>{
        expect(todo).toBeFalsy();
        done();
      }).catch((e)=>done(e))
    });
  });
  it("should return 404 of todo not found",(done)=>{
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  });
  it("should return 404 for non-object ids",(done)=>{
    request(app)
      .delete("/todos/123")
      .expect(404)
      .end(done)
  })
});
describe("PATCH/todo",()=>{
  it("should update the todo",(done)=>{
    //grab id of first todo, update text and set completed to true
    //expect the status 200, text received is same as send and completedAt is a number
    var id=Todos[0]._id.toHexString();
    var text="some dummy text";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed:true
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');

      })
      .end(done)
  });
  it("should clear completedAt when todo is completed",(done)=>{
    //grab id of second todo item
    //update text, completed as false
    //200, text is updated, completed is false and completedAt is null
    var id=Todos[1]._id.toHexString();
    var text="crafting";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed:false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  })
})
