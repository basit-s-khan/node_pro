const express = require('express');
require("dotenv").config()
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


mongoose.connect("mongodb://127.0.0.1:27017/UserDB")

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt , {secret: process.env.SECRET ,encryptedFields : ["password"]});


const User = new mongoose.model('User',userSchema);


const app = express();


app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended : true}));

app.get("/" ,(req , res) => {
    res.render('home');
})

app.get("/login" ,(req , res) => {
    res.render('login');
})

app.get("/register" ,(req , res) => {
    res.render('register');
})

app.post("/register" ,(req , res)=>{
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save()
        .then(()=>{
            res.render('secrets');
        }).catch(()=>{
            res.send(500 + ' Error')
        });
})

app.post("/login" , (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email : username})
        .then((user)=>{
            if(user){
                if(user.password === password){
                    res.render("secrets")
                }
            }
        }).catch((err)=>{
            alert("You should to register First !")
            res.redirect("/register")
        })
})
app.listen(3000 , function(){
    console.log("listening on port 3000...")
})