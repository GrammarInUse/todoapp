const Sequelize = require("sequelize");
const db = require("./db").db;

const Model = Sequelize.Model;

class photos extends Model { 
    static getLength(){
        return photos.length;
    }
    static async getLastId(id){
        var listOfPhotos = await photos.findByUserId(id);
        var i = 1;
        listOfPhotos.forEach((x) => {
            if(x.id >= i){
                i = x.id;
            }
        });
        console.log(i);
        return i;
    }
    static async getLostId(id){
        var iPos = 0;
        var lists = [];
        var listOfPhotos = await photos.findByUserId(id);
        const len = listOfPhotos.length;
        var iNeed = 1, iSumOfList = 1;
        var bCheck = true;
        while(bCheck){
            iSumOfList = 1;
            await listOfPhotos.forEach((x) => {

                if(iNeed == x.id){
                    iSumOfList--;
                }
                if(len == iSumOfList) {
                    lists[iPos] = iNeed;
                    iPos++;
                }
                else iSumOfList++;
            });
            iNeed++;
            if(iNeed>=len + 1 && lists[0] == undefined){
                bCheck = false;
                lists[0] = len + 1;
            }else if(iNeed>=len + 1){
                bCheck = false;
            }
        }
        return lists;
    }
    static async findById(id){
        return await photos.findOne({
            where: {
                id: id
            }
        })
    }
    static async deleteById(id){
        return await photos.destroy({
            where: {
                id: id
            }
        });
    }
    static async findByUserId(id){
        return await photos.findAll({
            where: {
                userId: id
            }
        })
    }
    static async insertPhoto(userId, extension, idNeed){
        // const listOfPhotos = await photos.findAll({
        //     where: {
        //         userId: userId
        //     }
        // })
        // console.log(listOfPhotos);
        const strName = "photo-" + idNeed[0];
        console.log(strName);
        return await photos.create({
            id: idNeed[0],
            name: strName,
            userId: userId,
            extension: extension
        });
    }
}

photos.init(
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        extension: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }
    ,
    {
        sequelize: db,
        modelName: "photos"
    }
);



module.exports = { photos };