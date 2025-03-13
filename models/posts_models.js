const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;