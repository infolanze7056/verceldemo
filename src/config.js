const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://manish091102:newproject@cluster0.vilztto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

connect.then(() => {
    console.log("Database connected succesfully")
})
.catch(()=>{
    console.log("databse is not connected")
})


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phonenumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
});

const collection = new mongoose.model("user", LoginSchema);

module.exports = collection;