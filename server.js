const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
var Users = require("./services/users").users;
const Todos = require("./services/todos").todos;
var db = require("./services/db").db;
const pg = require("pg");

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
    if(!user){
        res.redirect("/login");
    }else{
        if(!(await Users.verifyPassword(req.body.password, user.password))){
            res.redirect("/login");
        }
        else{
            req.session.currentUser = user;
            res.redirect("/home");
        }
    }
});

app.get("/home", (req, res) => {
    const currentUser = req.session.currentUser;
    if(currentUser){
        res.render("home", {currentUser});
    }
    else res.render("home-notlogin");
});

app.get("/profile", (req, res) => {
    const currentUser = req.session.currentUser;
    res.render("profile", {currentUser});
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
    const listOfDoneTodos = req.session.listOfNotDoneTodos;
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

db.sync().then(function(){
    const port = process.env.PORT || 3000;
    app.listen(port, function(){
        console.log("KET NOI THANH CONG");
    });
}).catch(function(){
    console.log("Loi roi");
});










