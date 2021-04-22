const fs = require('fs');
const path = require('path');

clearImage = (filePath) => {
    const file = path.join(__dirname,'..', filePath);
    fs.unlink(file,err => console.log(err));
}

module.exports = clearImage;