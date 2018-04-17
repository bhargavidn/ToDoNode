var mongoose=require("mongoose");


var toDo=mongoose.model("Todo",{
  text:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  completedAt:{
    type:Number,
    default:null
  },
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  maker:{
    type:String,
    required:true
  }
});

module.exports={toDo}
