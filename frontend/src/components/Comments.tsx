import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchComments, deleteComment, updateComment, Comment } from '../services/CommentService';
import { fetchPost, Post } from '../services/PostService';
import { Card, Button, Form, Container, Row, Col, Alert, Nav, Navbar, Image } from 'react-bootstrap';
import { FaTrash, FaEdit, FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './Profile';
import Logout from './Logout';

const DEFAULT_PROFILE_IMAGE_URL = 'http://localhost:3001/public/default_avatar.png';

const Comments: React.FC = () => {
  const { accessToken } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const getPostAndComments = async () => {
      if (accessToken && postId) {
        try {
          const post = await fetchPost(accessToken, postId);
          setPost(post);
          const comments = await fetchComments(accessToken, postId);
          setComments(comments);
        } catch (err) {
          setError('Failed to fetch post or comments');
        }
      }
    };

    getPostAndComments();
  }, [accessToken, postId]);

  const handleDeleteComment = async (commentId: string) => {
    if (accessToken) {
      try {
        await deleteComment(accessToken, commentId);
        const comments = await fetchComments(accessToken, postId!);
        setComments(comments);
        toast.success('Comment deleted successfully!');
      } catch (err) {
        setError('Failed to delete comment');
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && editingCommentId) {
      try {
        await updateComment(accessToken, editingCommentId, editingContent);
        const comments = await fetchComments(accessToken, postId!);
        setComments(comments);
        setEditingCommentId(null);
        setEditingContent('');
        toast.success('Comment updated successfully!');
      } catch (err) {
        setError('Failed to update comment');
        toast.error('Failed to update comment');
      }
    }
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment._id || null);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  return (
    <div className="d-flex">
      <Navbar bg="light" className="flex-column vh-100 p-3 position-fixed" style={{ width: '200px' }}>
        <div className="text-center mb-4">
          <Image src={DEFAULT_PROFILE_IMAGE_URL} roundedCircle width="100" height="100" />
        </div>
        <Nav className="flex-column w-100">
          <Nav.Link as={Link} to="/" className="d-flex align-items-center mb-2">
            <FaHome className="me-2" /> Home
          </Nav.Link>
          <Profile />
        </Nav>
        <Nav className="flex-column w-100 mt-auto">
          <Logout />
        </Nav>
      </Navbar>
      <Container className="flex-grow-1 vh-100 overflow-auto" style={{ marginLeft: '200px', backgroundColor: '#f2f2f2' }}>
        <ToastContainer />
        <Row className="justify-content-md-center">
          <Col md={8}>
            {post && (
              <div className="shadow-sm p-4 mb-4 bg-white rounded" style={{ borderRadius: '20px' }}>
                <h2 className="text-left">{post.title}</h2>
                <p>{post.content}</p>
                  {post.imageUrl &&            <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '10px' }}>
                            <Card.Img 
                              variant="top" 
                              src={post.imageUrl} 
                              style={{ width: '50px', height: 'auto', borderRadius: '8px' }} 
                            />
                          </div>}
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            <h3 className="text-center">Comments</h3>
            {comments.map((comment) => (
              <Card key={comment._id} className="mb-3 shadow-sm rounded">
                <Card.Body>
                  {editingCommentId === comment._id ? (
                    <Form onSubmit={handleEditComment}>
                      <Form.Group className="mb-3" controlId="formEditContent">
                        <Form.Label>Edit your comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="Edit your comment"
                          className="rounded-pill px-3 py-2"
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit" className="w-100 mb-2 rounded-pill">
                        Update Comment
                      </Button>
                      <Button variant="secondary" onClick={cancelEditing} className="w-100 rounded-pill">
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {new Date(comment.createdAt!).toLocaleString()}
                        </span>
                        <div>
                          {comment.user._id === accessToken && (
                            <>
                              <Button variant="outline-primary" onClick={() => startEditingComment(comment)} size="sm" className="rounded-pill me-2">
                                <FaEdit /> Edit
                              </Button>
                              <Button variant="outline-danger" onClick={() => handleDeleteComment(comment._id!)} size="sm" className="rounded-pill">
                                <FaTrash /> Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <Card.Text className="fw-bold" style={{ fontSize: '1.1rem' }}>{comment.user.username}</Card.Text>
                      <Card.Text className="mb-2" style={{ fontSize: '1rem' }}>{comment.content}</Card.Text>
                    </>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Comments;