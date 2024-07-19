const mongoose = require('mongoose');
const {Schema} = mongoose;

const NewBookSchema = new Schema({
    title : String,
    isbn : {type:String ,unique:true, required: true},
    rating: {type:Number },
    material:{ type: String, required: true }
}, { collection: 'newBooks' })

const NewBookModel = mongoose.model('newBooks',NewBookSchema);

module.exports = NewBookModel;