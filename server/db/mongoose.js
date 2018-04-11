var mongoose=require("mongoose");

//connect to mongodb
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp",{
  useMongoClient: true
});

//mongoose.connect("mongodb://bhargavi.dn:Bhagi@123@ds239009.mlab.com:39009/todolist");
//to use promise
mongoose.Promise=global.Promise;

module.exports={mongoose};
