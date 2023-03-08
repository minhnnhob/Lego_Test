const mongoose = require('mongoose');
async function connect(){

    try {
        await mongoose.connect('mongodb+srv://Minh123:Minh123@legotoys.xubnnh0.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connect Failed');
    }

}
module.exports = {connect};