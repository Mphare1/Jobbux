import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(0);
  const [imageFileError, setImageFileError] = useState(null);
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Check if file is larger than 2MB
        setImageFileError('File size exceeds 2MB');
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
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

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}>
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
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <TextInput
          type='email'
          id='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <TextInput
          type='password'
          id='password'
          placeholder='Password'
          className='bg-gray-100 border-gray-300 rounded-lg'
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
