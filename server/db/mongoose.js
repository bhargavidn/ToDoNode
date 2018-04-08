var mongoose=require("mongoose");

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/TodoApp");
//to use promise
mongoose.Promise=global.Promise;

module.exports={mongoose};
