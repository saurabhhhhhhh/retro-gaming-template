const mongoose =require('mongoose')

const UserSchema = mongoose.Schema(
    {
        
        username:String,
        email: { type: String, unique: true },
        password: String
    },{
        collections:"Users"
    }
)

mongoose.model("Users", UserSchema);
