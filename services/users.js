const Sequelize = require("sequelize");
const db = require("./db"),
sequelize = db.db;

const Model = Sequelize.Model;
class users extends Model { 
    static verifyPassword(password, passwordDB){
        if(password == passwordDB) return true;
        else return false;
    }
    static async findUserById(id){
        return Users.findUserById(id);
    }
    
    static async findUserByEmail(email){
        return users.findOne({
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





