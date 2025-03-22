import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, likePost, unlikePost, commentOnPost, deletePost, updatePost } from '../services/PostService';
import { fetchUserProfile, updateUserProfile } from '../services/UserService';
import { Card, Button, Form, Container, Row, Col, Alert, Nav, Navbar, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaThumbsUp, FaThumbsDown, FaComment, FaHome, FaUser, FaSignOutAlt, FaFilter } from 'react-icons/fa'; // Import icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PROFILE_IMAGE_URL = 'http://localhost:3001/public/default_avatar.png';

interface Post {
  title: string;
  content: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [profile, setProfile] = useState({ email: '', username: '', imageUrl: ''});
  const [profileEditing, setProfileEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [showUserPosts, setShowUserPosts] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (accessToken) {
        try {
          const posts = await fetchPosts(accessToken);
          setPosts(posts);
        } catch (err) {
          setError('Failed to fetch posts');
          toast.error('Failed to fetch posts');
        }
      }
    };

    const getProfile = async () => {
      if (accessToken) {
        try {
          const profile = await fetchUserProfile(accessToken);
          if (!profile.imageUrl) {
            profile.imageUrl = DEFAULT_PROFILE_IMAGE_URL;
          }
          setProfile(profile);
          setNewUsername(profile.username);
        } catch (err) {
          setError('Failed to fetch profile');
          toast.error('Failed to fetch profile');
        }
      }
    };

    getPosts();
    getProfile();
  }, [accessToken]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && content && title) {
      const newPost: Post = { title, content };
      try {
        await createPost(accessToken, newPost);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        setTitle('');
        setContent('');
        toast.success('Post created successfully!');
      } catch (err) {
        setError('Failed to create post');
        toast.error('Failed to create post');
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    if (accessToken) {
      try {
        await likePost(accessToken, postId);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        toast.success('Post liked!');
      } catch (err) {
        setError('Failed to like post');
        toast.error('Failed to like post');
      }
    }
  };

  const handleUnlikePost = async (postId: string) => {
    if (accessToken) {
      try {
        await unlikePost(accessToken, postId);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        toast.success('Post unliked!');
      } catch (err) {
        setError('Failed to unlike post');
        toast.error('Failed to unlike post');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (accessToken) {
      try {
        await deletePost(accessToken, postId);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        toast.success('Post deleted successfully!');
      } catch (err) {
        setError('Failed to delete post');
        toast.error('Failed to delete post');
      }
    }
  };

  const handleCommentOnPost = async (postId: string, comment: string) => {
    if (accessToken) {
      try {
        if (!comment) {
          setError('Comment cannot be empty');
          toast.error('Comment cannot be empty');
          return;
        }
        await commentOnPost(accessToken, postId, comment);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        toast.success('Comment added!');
      } catch (err) {
        setError('Failed to comment on post');
        toast.error('Failed to comment on post');
      }
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && editingTitle && editingContent && editingPostId) {
      const updatedPost: Post = { title: editingTitle, content: editingContent };
      try {
        await updatePost(accessToken, editingPostId, updatedPost);
        const posts = await fetchPosts(accessToken);
        setPosts(posts);
        setEditingPostId(null);
        setEditingTitle('');
        setEditingContent('');
        toast.success('Post updated successfully!');
      } catch (err) {
        setError('Failed to update post');
        toast.error('Failed to update post');
      }
    }
  };

  const startEditingPost = (post: any) => {
    setEditingPostId(post._id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingTitle('');
    setEditingContent('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && newUsername) {
      const updatedProfile = { email: profile.email, username: newUsername };
      try {
        await updateUserProfile(accessToken, updatedProfile, newImage);
        const profile = await fetchUserProfile(accessToken);
        setProfile(profile);
        setProfileEditing(false);
        toast.success('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile');
        toast.error('Failed to update profile');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
      toast.success('Logged out successfully!');
    } catch (err) {
      setError('Failed to logout');
      toast.error('Failed to logout');
    }
  };

  const filteredPosts = showUserPosts
    ? posts.filter((post) => post.isCreatedByCurrentUser)
    : posts;

  return (
    <div className="d-flex">
      <Navbar bg="light" className="flex-column vh-100 p-3 position-fixed" style={{ width: '200px' }}>
        <div className="text-center mb-4">
          <Image src={profile.imageUrl || 'https://via.placeholder.com/100'} roundedCircle width="100" height="100" />
        </div>
        <Nav className="flex-column w-100">
          <Nav.Link as={Link} to="/" className="d-flex align-items-center mb-2">
            <FaHome className="me-2" /> Home
          </Nav.Link>
          <Nav.Link onClick={() => setProfileEditing(true)} className="d-flex align-items-center mb-2">
            <FaUser className="me-2" /> Profile
          </Nav.Link>
        </Nav>
        <Nav className="flex-column w-100 mt-auto">
          <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </Navbar>
      <div className="flex-grow-1 vh-100 overflow-auto" style={{ marginLeft: '200px', backgroundColor: '#f2f2f2' }}>
        <Container>
          <ToastContainer />
          <Row className="justify-content-md-center">
            <Col md={8}>
              <h2 className="text-center"><hr></hr></h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleCreatePost}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the title"
                    className="rounded-pill px-3 py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formContent">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="rounded-pill px-3 py-2"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn w-100 rounded-pill py-2"
                  style={{ backgroundColor: '#9933ff', color: 'white', fontWeight: 'bold' }}
                >
                  Create Post
                </Button>
              </Form>
              <hr />
              <Button
                variant="outline-primary"
                className="mb-3"
                onClick={() => setShowUserPosts(!showUserPosts)}
              >
                <FaFilter /> {showUserPosts ? 'Show All Posts' : 'Show My Posts'}
              </Button>
              {filteredPosts.map((post) => (
                <Card key={post._id} className="mb-3">
                  <Card.Body>
                    {editingPostId === post._id ? (
                      <Form onSubmit={handleEditPost}>
                        <Form.Group className="mb-3" controlId="formEditTitle">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            placeholder="Enter the title"
                            className="rounded-pill px-3 py-2"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditContent">
                          <Form.Label>Content</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="rounded-pill px-3 py-2"
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          className="btn w-100 rounded-pill py-2 mb-2"
                          style={{ backgroundColor: '#9933ff', color: 'white', fontWeight: 'bold' }}
                        >
                          Update Post
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={cancelEditing}
                          className="btn w-100 rounded-pill py-2"
                        >
                          Cancel
                        </Button>
                      </Form>
                    ) : (
                      <>
                        <Card.Subtitle className="mb-3 text-muted">
                          {new Date(post.createdAt).toLocaleString()}
                        </Card.Subtitle>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        {post.imageUrl && <Card.Img variant="top" src={post.imageUrl} />}
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const comment = (e.currentTarget.elements.namedItem('comment') as HTMLInputElement).value;
                            handleCommentOnPost(post._id, comment);
                          }}
                        >
                          <Form.Group className="mt-3" controlId="formComment">
                            <Form.Control
                              type="text"
                              name="comment"
                              placeholder="Add a comment..."
                              className="rounded-pill px-3 py-2"
                            />
                          </Form.Group>
                          <br />
                          <Button
                            style={{ marginRight: '10px' }}
                            variant="outline-secondary"
                            type="submit"
                            className="rounded-pill px-3 py-2"
                          >
                            <FaComment /> Comment
                          </Button>
                          {post.isLikedByCurrentUser ? (
                            <Button
                              variant="outline-secondary"
                              onClick={() => handleUnlikePost(post._id)}
                              className="rounded-pill px-3 py-2"
                            >
                              <FaThumbsDown /> Unlike
                            </Button>
                          ) : (
                            <Button
                              style={{ marginRight: '10px' }}
                              variant="outline-primary"
                              onClick={() => handleLikePost(post._id)}
                              className="rounded-pill px-3 py-2"
                            >
                              <FaThumbsUp /> Like
                            </Button>
                          )}
                        </Form>
                        <div className="d-flex justify-content-end align-items-center">
                          <span style={{ margin: '10px' }}>{post.numOfLikes} Likes</span>
                          <Link to={`/posts/${post._id}/comments`}>{post.numOfComments} Comments</Link>
                        </div>
                      </>
                    )}
                  </Card.Body>
                  {post.isCreatedByCurrentUser && (
                    <div
                      className="position-absolute"
                      style={{ top: '10px', right: '10px', zIndex: 10 }}
                    >
                      <Button
                        variant="outline-primary"
                        onClick={() => startEditingPost(post)}
                        size="sm"
                        className="rounded-pill px-3 py-2"
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDeletePost(post._id)}
                        size="sm"
                        className="ml-2 rounded-pill px-3 py-2"
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
      {profileEditing && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white p-4 rounded">
            <h4>Edit Profile</h4>
            <Form onSubmit={handleUpdateProfile}>
              <Form.Group className="mb-3" controlId="formProfileUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="rounded-pill px-3 py-2"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formProfileImage">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setNewImage((e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null)}
                  className="rounded-pill px-3 py-2"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="btn w-100 rounded-pill py-2 mb-2"
                style={{ backgroundColor: '#9933ff', color: 'white', fontWeight: 'bold' }}
              >
                Update Profile
              </Button>
              <Button
                variant="secondary"
                onClick={() => setProfileEditing(false)}
                className="btn w-100 rounded-pill py-2"
              >
                Cancel
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;