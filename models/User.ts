import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// defining type of User 
export interface IUser{
    _id?:mongoose.Types.ObjectId
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;

}

//creating a schema
const userSchema = new Schema<IUser>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

//has the password befor seving using pre hook 
userSchema.pre("save", async function (next) {
    // this represent the context above
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
    
})

//if user schema alredy exist retrun user model nor creat a model
const User = models?.User || model<IUser>("User", userSchema)


export default User;
