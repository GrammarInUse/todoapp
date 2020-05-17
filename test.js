const Photos = require("./services/photos").photos;

async function tempFunction(){
    var k = await Photos.getLostId(1);
    console.log("KET QUA LA: ", k[0]);
}

tempFunction();