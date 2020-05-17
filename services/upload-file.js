const multer = require("multer");
const Photos = require("./photos").photos;

function uploadAvatar(){
    const storageAvatar = multer.diskStorage(
        {
            destination: (req, file, cb) =>{
                const currentUser = req.session.currentUser;
                cb(null, './public/PhotosOfId' + currentUser.id);
            },
            filename: function(req, file, cb){
                const currentUser = req.session.currentUser;
                cb(null, "avatar-user.jpg");
            }
        }
    );
    var uploadAvatar = multer(
        {
            storage: storageAvatar
        }
    );
    return uploadAvatar;
}
function uploadBackground(){
    const storageBackground = multer.diskStorage(
        {
            destination: (req, file, cb) =>{
                const currentUser = req.session.currentUser;
                cb(null, './public/PhoTosOfId' + currentUser.id);
            },
            filename: function(req, file, cb){
                cb(null, "bg-user.jpg");
            }
        }
    );
    var uploadBackground = multer(
        {
            storage: storageBackground
        }
    );
    return uploadBackground;
}

function uploadPhoto(){
    const storagePhotos = multer.diskStorage(
        {
            destination: (req, file, cb) =>{
                cb(null, './public/PhotosOfId' + req.session.currentUser.id);
            },
            filename: async function(req, file, cb){
                const idNeed = await Photos.getLostId(req.session.currentUser.id);
                const listOfPhotos = await Photos.findByUserId(req.session.currentUser.id);
                let len = listOfPhotos.length;
                console.log("So hinh anh trong list la: ", len);
                if(idNeed == undefined){
                    idNeed[0] = len + 1;
                }
                let strExtension = file.mimetype.toString().substring(6);
                await Photos.insertPhoto(req.session.currentUser.id, strExtension, idNeed);
                cb(null, "photo-" + idNeed[0] + "." + strExtension);
            }
        }
    );
    var uploadPhoto = multer(
        {
            storage: storagePhotos
        }
    );
    return uploadPhoto;
}







module.exports = { uploadAvatar, uploadPhoto, uploadBackground };