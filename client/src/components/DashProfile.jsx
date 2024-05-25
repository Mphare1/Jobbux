import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure,
          deleteUserStart, deleteUserSuccess, deleteUserFailure
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(0);
  const [imageFileError, setImageFileError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({}); // Fixed state initialization
  const filePickerRef = useRef();
  const dispatch = useDispatch(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
        setImageFileError('File size exceeds 2MB');
        setImageFileUploading(false);
        return;
      }
      setImageFileError(null); // Clear any previous error
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileError(null); // Clear any previous error
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(Math.floor(progress)); // Ensure it's a number
      },
      (error) => {
        setImageFile(null);
        setImageFileUrl(null);
        const errorMessages = {
          'storage/unauthorized': 'User does not have permission to access the object',
          'storage/canceled': 'User canceled the upload',
          'storage/unknown': 'Unknown error occurred, inspect error.serverResponse',
        };
        setImageFileError(errorMessages[error.code] || 'Failed to upload image (max size: 2MB)');
        setImageFileUploadingProgress(0);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prevFormData) => ({ ...prevFormData, profilePicture: downloadURL }));
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const progressBarStyles = {
    root: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    path: {
      stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
    },
  };

  const handleSubmit = async (e) => {
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Please update at least one field');
      return;
    }
    dispatch(updateStart());
    if (imageFileUploading) {
      setUpdateUserError('Please wait for the image to finish uploading');
      return;
    }
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
const handleDeleteUser = async () => {
  setShowModal(false);
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(deleteUserFailure(data.message));
    } else {
      dispatch(deleteUserSuccess());
    }
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress > 0 && imageFileUploadingProgress < 100 && (
            <CircularProgressbar
              value={imageFileUploadingProgress}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={progressBarStyles}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress > 0 && imageFileUploadingProgress < 100 ? 'opacity-50' : ''}`}
          />
        </div>
        {imageFileError && (
          <Alert color='failure'>{imageFileError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='Username'
          defaultValue={currentUser.username}
          onChange={handleChange}
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <TextInput
          type='email'
          id='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <TextInput
          type='password'
          id='password'
          placeholder='Password'
          onChange={handleChange}
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-4'>{updateUserSuccess}</Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-4'>{updateUserError}</Alert>
      )}
            {error && (
        <Alert color='failure' className='mt-4'>{error}</Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
       <Modal.Header/>
        <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 mb-4 mx-auto"/>
          <h1 className="mb-5 text-lg">Are you sure you want to delete your Account?</h1>
        <div className="flex justify-center gap-4">
          <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
          <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
          </div>
        </div>
          </Modal.Body>
        </Modal>
    </div>
  );
}
