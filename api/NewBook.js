const mongoose = require('mongoose');
const {Schema} = mongoose;

const NewBookSchema = new Schema({
    title : {type:String , required: true},
    isbn : {type:String ,unique:true, required: true},
    rating: {type:Number },
    material:{ type: String, required: true },
    genre: { type: String, required: true },
    author:{ type: String, required: true },    
    des:{ type: String}
    
}, { collection: 'uploadedBook' })

const NewBookModel = mongoose.model('uploadedBook',NewBookSchema);

module.exports = NewBookModel;