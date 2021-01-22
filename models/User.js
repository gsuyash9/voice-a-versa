const mongoose = require('mongoose');
const { isEmail }=require('validator');

const bcrypt = require('bcrypt');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required: [true,"Please enter an email"],
        unique: true,
        lowercase:true,
        validate:[isEmail,"Please enter the valid email"]
    },
    password:{
        type:String,
        required: [true,"Please enter the password"],
        minlength:[6,"Minimum length must be 6"]
    }
}) 
userSchema.post('save',function(doc,next){
    console.log("user is created and saved",doc);
    next();
});

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };




const User = mongoose.model('user',userSchema);
module.exports = User;