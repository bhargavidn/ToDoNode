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
  text:"Studying"
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
  this.timeout(5000);
  it("should return todos",(done)=>{
    request('app')
      .get("/todos")
      .expect(200)
      .then((res)=>{
        expect(res.body.docs.length).toBe(2);
      }).catch((e)=>done(e));
  });
})
describe("GET /todos/id",function(){
  it("should return a todo",(done)=>{
    request(app)
      .get(`/todos/${Todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.doc.text).toBe(Todos[0].text);
      }).end(done);
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
})
