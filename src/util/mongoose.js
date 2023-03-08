//convert objects from db
module.exports = {
    convertToArrayObjects: function(mongoosesArrays){
        return mongoosesArrays.map(mongoose => mongoose.toObject());
    },
    convertToObject: function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;//if mongoose is Exist => return mongoose.toObject(), if not: return itself so the hbs cant not read the result but the application will not be crashed
    }
}