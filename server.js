const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const Users = require("./services/users").users;
const Todos = require("./services/todos").todos;
const Photos = require("./services/photos").photos;
var db = require("./services/db").db;
const fs = require("fs");
const pg = require("pg");
const Email = require("./services/send-email");
const uploadAvatar = require("./services/upload-file").uploadAvatar;
const uploadBackground = require("./services/upload-file").uploadBackground;
const uploadPhoto = require("./services/upload-file").uploadPhoto;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
const urlEncodedParser = bodyParser.urlencoded({extended: false});

app.use(cookieSession({
    name: "session",
    keys: ["Taolatao0"],
    maxAge: 24* 60* 60* 1000
}));

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/login", (req, res, next) =>{
    if(!req.session.currentUser){
        res.render("login");
    }
    else res.redirect("/home");
});

app.post("/login", urlEncodedParser, async (req, res) => {
    if(req.session.currentUser){
        req.redirect("/home");
    }
    var user = await Users.findUserByUsername(req.body.username);
    if(user == null){
        res.redirect("/login");
    }else{
        if((await Users.verifyPassword(req.body.password, user.password)) === false || user.token != null){
            res.redirect("/login");
        }
        else{
            req.session.currentUser = user;
            res.redirect("/home");
        }
    }
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/signup", urlEncodedParser,async (req, res) => {
    const id = (await Users.findAll()).length + 1;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const comfirmpassword = req.body.comfirmpassword;
    const fullname = req.body.fullname;
    const phone = req.body.phone;

    const tempUser = await Users.signUp(username, email, password, comfirmpassword, fullname, phone).then(console.log("Seccess"));

    await Email.Send(tempUser);
    console.log(tempUser);

    res.redirect("/comfirm-email")
});
app.get("/signup/:id/:token", async (req, res) => {
    console.log(req.params.id);
    console.log(req.params.token);
    const user = await Users.findUserById(req.params.id);
    console.log("User lấy từ thanh địa chỉ: ",user);
    
    if(req.params.token == user.token){
        user.token = null;
        await user.save();
    }
    //req.session.currentUser = user;
    res.redirect("/login");
});


app.get("/home", async (req, res) => {
    var tempUser = null;
    const currentUser = req.session.currentUser;
    if(currentUser){
        tempUser = await Users.findUserById(currentUser.id);
    }
    
    if(currentUser && !tempUser){
        delete req.session.currentUser;
        res.render("home-notlogin");
    }
    else if(currentUser && tempUser){
        res.render("home", {currentUser});
    }
    else if(!currentUser && tempUser){
        res.render("home-notlogin");
    }
    else res.render("home-notlogin");
});

app.get("/profile", async (req, res) => {
    const currentUser = await Users.findUserById(req.session.currentUser.id);
    const listOfPhotos = await Photos.findByUserId(currentUser.id);
    console.log(listOfPhotos.length);

    fs.mkdir("./public/PhotosOfId" + currentUser.id, () => {
        console.log("Tao new folder thanh cong");
    });
    res.render("profile", {currentUser, listOfPhotos});
});

app.get("/todolist", async (req, res) => {
    const currentUser = req.session.currentUser;
    const listOfTodos = await Todos.findTodoByNotDone(currentUser.id);
    req.session.listOfNotDoneTodos = listOfTodos;
    const listOfNotDoneTodos = req.session.listOfNotDoneTodos;
    res.render("todolist", {listOfNotDoneTodos, currentUser});
});

app.get("/history", async (req, res) => {
    const currentUser = req.session.currentUser;
    const listOfTodos = await Todos.findTodoByDone(currentUser.id);
    req.session.listOfDoneTodos = listOfTodos;
    const listOfDoneTodos = req.session.listOfDoneTodos;
    res.render("history", {listOfDoneTodos, currentUser});
});

app.get("/addwork", (req, res) => {
    const currentUser = req.session.currentUser;
    res.render("addwork", {currentUser});
});

app.post("/addwork", urlEncodedParser, async (req, res) => {
    const currentUser = req.session.currentUser;
    const thingtodo = req.body.thingtodo;
    await Todos.insertTodo(thingtodo, currentUser.id).then(console.log("Success"));

    res.redirect("/todolist");
});

app.get("/logout", (req, res) => {
    delete req.session.currentUser;
    res.redirect("/login");
});

app.get("/xulyxong/:id", (req, res) => {
    Todos.markAsDone(req.params.id);
    res.redirect("/todolist");
});
app.get("/comfirm-email", (req, res)=>{
    res.render("comfirm-email");
});

app.get("/upload-file", (req, res) => {
    res.render("upload-file");
});

app.get("/upload-avatar", (req, res) => {
    res.render("upload-file.ejs");
});

app.post("/upload-avatar", uploadAvatar().single("file"), async (req, res, next) => {
    const user = await Users.findUserById(req.session.currentUser.id);
    console.log(user);
    user.avatar = "avatar-user.jpg";
    await user.save();
    req.session.currentUser = user;
    const file = await req.file;
    if(!file){
        const error = new Error("Please upload a image file");
        error.httpStatusCode = 400;
        return next(error);
    }else{
        res.redirect("/profile");
    }
});
app.post("/upload-background", uploadBackground().single("file"), async (req, res, next) => {
    const user = await Users.findUserById(req.session.currentUser.id);
    console.log(user);
    user.background = "bg-user.jpg";
    await user.save();
    req.session.currentUser = user;
    const file = await req.file;
    if(!file){
        const error = new Error("Please upload a image file");
        error.httpStatusCode = 400;
        return next(error);
    }else{
        res.redirect("/profile");
    }
});

app.post("/upload-photo", uploadPhoto().single("file"), async (req, res, next) => {
    const listOfPhotos = await Photos.findByUserId(req.session.currentUser.id);
    console.log(listOfPhotos);
    const file = await req.file;
    if(!file){
        const error = new Error("Please upload a image file");
        error.httpStatusCode = 400;
        return next(error);
    }else{
        res.redirect("/profile");
    }
});

app.get("/delete-photo/:id", async (req, res) => {
    Photos.deleteById(req.params.id);

    res.redirect("/profile");
});

db.sync().then(async function(){
    const port = process.env.PORT || 3000;
    app.listen(port, function(){
        console.log("KET NOI THANH CONG");
    });
}).catch((err) => {
    console.log(err);
});










