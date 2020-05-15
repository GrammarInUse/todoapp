const Sequelize = require("sequelize");
const Crypto = require("crypto");
const db = require("./db"),
sequelize = db.db;

const Model = Sequelize.Model;
class users extends Model { 
    static verifyPassword(password, passwordDB){
        if(password == passwordDB) return true;
        else return false;
    }
    static async signUp(userName, mail, pass, comfirmPass, fullName, phone){
        const listOfUsers = users.findAll();
        var id = (await listOfUsers).length + 1;
        console.log(id + userName + mail);
        return await users.create({
            id: id, 
            username: userName,
            email: mail,
            password: pass,
            name: fullName,
            phone: phone,
            token: Crypto.randomBytes(3).toString('hex').toUpperCase()
        });
    }
    static async findUserById(id){
        return await users.findOne({
            where: {
                id: id
            }
        });
    }
    
    static async findUserByEmail(email){
        return await users.findOne({
            where: {
                email: email
            }
        });
    }
    static async findUserByUsername(username){
        return users.findOne({
            where: {
                username: username
            }
        });
    }
    static async findUserByPhone(phone){
        return users.findOne({
            where: {
                phone
            }
        });
    }
    static async findUserByName(name){
        return users.findOne({
            where: {
                name
            }
        });
    }
}
users.init(
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false, 
            unique: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        email: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        phone: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        token:{
            type: Sequelize.TEXT,
            allowNull: true,
            unique: true
        }
    },
    {   
        sequelize: sequelize,
        modelName: "users"
    }
);

module.exports = {
    users
};





