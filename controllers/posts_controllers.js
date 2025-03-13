const getAllPosts = (req, res) => {
    console.log('get all posts');
    res.send('get all posts');  
}
const createPost = (req, res) => {
    console.log('create post');
    res.send('create post');

};


module.exports = {
    getAllPosts,
    createPost
};