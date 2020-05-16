const multer = require("multer");

const storageAvatar = multer.diskStorage(
    {
        destination: (req, file, cb) =>{
            cb(null, './public/img');
        },
        filename: function(req, file, cb){
            cb(null, "avatar-user.jpg");
        }
    }
);

const storagePhotos = multer.diskStorage(
    {
        destination: (req, file, cb) =>{
            cb(null, './public/img');
        },
        filename: function(req, file, cb){
            cb(null, file.originalname);
        }
    }
);

const storageBackground = multer.diskStorage(
    {
        destination: (req, file, cb) =>{
            cb(null, './public/img');
        },
        filename: function(req, file, cb){
            cb(null, "bg-user.jpg");
        }
    }
);

var uploadAvatar = multer(
    {
        storage: storageAvatar
    }
);
var uploadPhotos = multer(
    {
        storage: storagePhotos
    }
);
var uploadBackground = multer(
    {
        storage: storageBackground
    }
);

module.exports = { uploadAvatar, uploadPhotos, uploadBackground };