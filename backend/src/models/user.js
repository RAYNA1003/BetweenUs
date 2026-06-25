import mongoose,{Schema} from "mongoose";

const userzoomSchema=new Schema(
    {
        name:{type:String,required:true},
        username:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        token:{type:String}
    }
)

const Userzoom=mongoose.model("Userzoom",userzoomSchema);
export {Userzoom};