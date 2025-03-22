import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchComments, deleteComment, updateComment, Comment } from '../services/CommentService';
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons

const Comments: React.FC = () => {
  const { accessToken } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const getComments = async () => {
      if (accessToken && postId) {
        try {
          const comments = await fetchComments(accessToken, postId);
          setComments(comments);
        } catch (err) {
          setError('Failed to fetch comments');
        }
      }
    };

    getComments();
  }, [accessToken, postId]);

  const handleDeleteComment = async (commentId: string) => {
    if (accessToken) {
      try {
        await deleteComment(accessToken, commentId);
        const comments = await fetchComments(accessToken, postId!);
        setComments(comments);
      } catch (err) {
        setError('Failed to delete comment');
      }
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken && editingContent && editingCommentId) {
      try {
    await updateComment(accessToken, editingCommentId, editingContent);
        const comments = await fetchComments(accessToken, postId!);
        setComments(comments);
        setEditingCommentId(null);
        setEditingContent('');
      } catch (err) {
        setError('Failed to update comment');
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
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center">Comments</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {comments.map((comment) => (
            <Card key={comment._id} className="mb-3">
              <Card.Body>
                {editingCommentId === comment._id ? (
                  <Form onSubmit={handleEditComment}>
                    <Form.Group className="mb-3" controlId="formEditContent">
                      <Form.Label>Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        placeholder="Edit your comment"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-2">
                      Update Comment
                    </Button>
                    <Button variant="secondary" onClick={cancelEditing} className="w-100">
                      Cancel
                    </Button>
                  </Form>
                ) : (
                  <>
                    <Card.Subtitle className="mb-3 text-muted">
                      {new Date(comment.createdAt!).toLocaleString()}
                    </Card.Subtitle>
                    <Card.Text>{comment.content}</Card.Text>
                    <Card.Text className="text-muted">- {comment.user.username}</Card.Text>
                    {comment.user._id === accessToken && (
                      <div className="d-flex justify-content-end">
                        <Button variant="outline-primary" onClick={() => startEditingComment(comment)} size="sm">
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleDeleteComment(comment._id!)} size="sm" className="ml-2">
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
          <Button variant="secondary" onClick={() => navigate(-1)} className="w-100 mt-3">
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Comments;