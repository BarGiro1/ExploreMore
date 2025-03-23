import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../services/UserService';
import { Form, Button, Modal, Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PROFILE_IMAGE_URL = 'http://localhost:3001/public/default_avatar.png';

const Profile: React.FC = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState({ email: '', username: '', imageUrl: '' });
  const [profileEditing, setProfileEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      if (accessToken) {
        try {
          const profile = await fetchUserProfile(accessToken);
          setProfile(profile);
        } catch (err) {
          toast.error('Failed to fetch profile');
        }
      }
    };

    getUserProfile();
  }, [accessToken]);

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

  return (
    <>
      <ToastContainer />
      <Button onClick={() => setProfileEditing(true)} className="d-flex align-items-center mb-2">
        <FaUser className="me-2" /> Profile
      </Button>
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
                  src={newImage ? URL.createObjectURL(newImage) : profile.imageUrl || DEFAULT_PROFILE_IMAGE_URL}
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
    </>
  );
};

export default Profile;