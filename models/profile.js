var mongoose = require("mongoose");
var util     = require("../util");

// schema
var StudySchema = mongoose.Schema({
  photo:{type:file, required:[true,"photo is required!"]},
  info:{type:String, required:[true,"info is required!"]},
  
   // 이름을 수정해보자	
  name:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
	
  // input 타입 정의하기.
  
  field:{},
  area:{},
  date:{},	
  time:{},
  start:{},
  
	
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

// virtuals
postSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
});

postSchema.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
});

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;
