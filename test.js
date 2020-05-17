const fs = require("fs");

fs.unlink("./public/PhotosOfId1/photo-3.png", (err) => {
    if(err) console.log("Co loi: ", err);
    else console.log("success");
});