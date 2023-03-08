const mongoose = require('mongoose');
async function connect(){

    try {
        await mongoose.connect('mongodb+srv://lego:lego@cluster0.3no8d6y.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connect Failed');
    }

}
module.exports = {connect};