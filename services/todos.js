const db = require("./db").db;
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class todos extends Model{ 
    static async findTodoByDone(id) {
        return await todos.findAll({
            where: {
                is_done: true,
                userId: id
            }
        });
    }
    static async findTodoByNotDone(id) {
        return await todos.findAll({
            where: {
                is_done: false,
                userId: id
            }
        });
    }
    static async markAsDone(id){
        const todo = await todos.findOne({
            where: {
                id: id
            }
        });
        todo.is_done = true;
        return await todo.save();
    }
    static async insertTodo(name, userId){
        const listOfTodos = todos.findAll();
        var todoId = (await listOfTodos).length + 1;
        return await todos.create({
            id: todoId,
            name: name,
            is_done: false,
            userId: userId
        });
    }
}

todos.init(
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        is_done: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, 
    {
        sequelize: db, 
        modelName: "todos"
    }
);

module.exports = {todos};