const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword: function(password){
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    },
    comparePassword: function(passRaw, passHashed){
        return bcrypt.compareSync(passRaw, passHashed);
    }
}