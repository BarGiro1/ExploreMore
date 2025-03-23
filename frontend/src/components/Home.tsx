import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, likePost, unlikePost, commentOnPost, deletePost, updatePost } from '../services/PostService';
import { fetchUserProfile, updateUserProfile } from '../services/UserService';
import { Card, Button, Form, Container, Row, Col, Alert, Nav, Navbar, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaThumbsUp, FaThumbsDown, FaComment, FaHome, FaFilter } from 'react-icons/fa'; // Import icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './Profile';
import Logout from './Logout';

const DEFAULT_PROFILE_IMAGE_URL = 'http://localhost:3001/public/default_avatar.png';

interface Post {
  title: string;
  content: string;
  imageUrl?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [profile, setProfile] = useState({ email: '', username: '', imageUrl: ''});
  const [profileEditing, setProfileEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [showUserPosts, setShowUserPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    const getPosts = async (page: number) => {
      if (accessToken) {
        try {
          const newPosts = await fetchPosts(accessToken, page);
          setPosts(prevPosts => {
            // Filter out duplicates
            const uniquePosts = newPosts.filter(newPost => !prevPosts.some(post => post._id === newPost._id));
            return [...prevPosts, ...uniquePosts];
          });
          setHasMore(newPosts.length > 0);
        } catch (err) {
          toast.error('Failed to fetch posts');
        }
      }
    };
  
    getPosts(page);
  }, [accessToken, page]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && content && title) {
      const newPost: Post = { title, content };
      try {
        await createPost(accessToken, newPost, image);
        const posts = await fetchPosts(accessToken, 1);
        setPosts(posts); // Replace the posts state with the new list
        setTitle('');
        setContent('');
        setImage(null);
        toast.success('Post created successfully!');
      } catch (err) {
        toast.error('Failed to create post');
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    if (accessToken) {
      try {
        await likePost(accessToken, postId);
        setPage(1);
        setPosts([]);
        const posts = await fetchPosts(accessToken, 1);
        setPosts(posts);
        toast.success('Post liked!');
      } catch (err) {
        toast.error('Failed to like post');
      }
    }
  };

  const handleUnlikePost = async (postId: string) => {
    if (accessToken) {
      try {
        await unlikePost(accessToken, postId);
        setPage(1);
        setPosts([]);
        const posts = await fetchPosts(accessToken, 1);
        setPosts(posts);
        toast.success('Post unliked!');
      } catch (err) {
        toast.error('Failed to unlike post');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (accessToken) {
      try {
        await deletePost(accessToken, postId);
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleCommentOnPost = async (postId: string, comment: string) => {
    if (accessToken) {
      try {
        if (!comment) {
          toast.error('Comment cannot be empty');
          return;
        }
        await commentOnPost(accessToken, postId, comment);
        setPage(1);
        setPosts([]);
        const posts = await fetchPosts(accessToken, 1);
        setPosts(posts);
        toast.success('Comment added!');
      } catch (err) {
        toast.error('Failed to comment on post');
      }
    }
  };

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && editingTitle && editingPostId) {
      const updatedPost: Post = { title: editingTitle, content: editingContent };
      try {
        await updatePost(accessToken, editingPostId, updatedPost);
        const posts = await fetchPosts(accessToken, 1);
        setPosts(posts); // Replace the posts state with the new list
        setEditingPostId(null);
        setEditingTitle('');
        setEditingContent('');
        toast.success('Post updated successfully!');
      } catch (err) {
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
        toast.error('Failed to update profile');
      }
    }
  };

  const filteredPosts = showUserPosts
    ? posts.filter((post) => post.isCreatedByCurrentUser)
    : posts;

  return (
    <div className="d-flex">
      <Navbar bg="light" className="flex-column vh-100 p-3 position-fixed" style={{ width: '200px' }}>
        <div className="text-center mb-4">
          <Image src={profile.imageUrl || DEFAULT_PROFILE_IMAGE_URL} roundedCircle width="100" height="100" />
        </div>
        <Nav className="flex-column w-100">
        <Nav.Link as={Link} to="/" className="d-flex align-items-center mb-2 nav-link">
          <FaHome className="me-2" /> Home
        </Nav.Link>
          <Profile />
        </Nav>
        <Nav className="flex-column w-100 mt-auto" style={{backgroundColor: "transparent"}}>
          <Logout />
        </Nav>
      </Navbar>
      <div className="flex-grow-1 vh-100 overflow-auto" style={{ marginLeft: '200px', backgroundColor: '#f2f2f2' }}>
        <Container>
          <ToastContainer />
          <Row className="justify-content-md-center">
            <Col md={8}>
              <br></br><br></br>
              <h2 className="text-center"> </h2>
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
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Control
                    type="file"
                    onChange={(e) => setImage((e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null)}
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
              {filteredPosts.map((post, index) => (
                <Card key={post._id} className="mb-3" ref={filteredPosts.length === index + 1 ? lastPostRef : null}>
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
                        {post.imageUrl && (
                          <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '10px' }}>
                            <Card.Img 
                              variant="top" 
                              src={post.imageUrl} 
                              style={{ width: '50px', height: 'auto', borderRadius: '8px' }} 
                            />
                          </div>
                        )}                     
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
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDeletePost(post._id)}
                        size="sm"
                        className="ml-2 rounded-pill px-3 py-2"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
      <Modal show={profileEditing} onHide={() => setProfileEditing(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              <div className="d-flex align-items-center">
                <Image
                  src={newImage ? URL.createObjectURL(newImage) : profile.imageUrl}
                  roundedCircle
                  width="50"
                  height="50"
                  className="me-3"
                />
                <Form.Control
                  type="file"
                  onChange={(e) => setNewImage((e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null)}
                  className="rounded-pill px-3 py-2"
                />
              </div>
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;