import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreateJob() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageError('Please select an image to upload');
        return;
      }
      setImageError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, 'jobImages/' + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageError(error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageError(null);
            setFormData((prevData) => ({ ...prevData, jobImage: downloadURL }));
          });
        }
      );
    } catch (error) {
      setImageError('Image upload failed, please try again later');
      setImageUploadProgress(null);
    }
  };

  useEffect(() => {
    if (file) {
      handleUploadImage();
    }
  }, [file]);

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Create Job</h1>
      <form className='flex flex-col space-y-5'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Job Title'
            required
            id='jobTitle'
            className='flex-1'
            onChange={(e) => setFormData((prevData) => ({ ...prevData, jobTitle: e.target.value }))}
          />
          <Select id='jobType' onChange={(e) => setFormData((prevData) => ({ ...prevData, jobType: e.target.value }))}
          >
            <option value='uncategorized'>Select Type</option>
            <option value='fulltime'>Full Time</option>
            <option value='parttime'>Part Time</option>
            <option value='internship'>Internship</option>
            <option value='freelance'>Freelance</option>
            <option value='temporary'>Temporary</option>
            <option value='contract'>Contract</option>
            <option value='remote'>Remote</option>
            <option value='volunteer'>Volunteer</option>
            <option value='seasonal'>Seasonal</option>
            <option value='hybrid'>Hybrid</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center sm:flex-row justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' id='jobImage' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
          <Button gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress !== null}>
            {imageUploadProgress !== null ? (
              <div className='w-16 h-16'>
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
          {imageError && <span className='text-red-500'>{imageError}</span>}
            {formData.jobImage && <img src={formData.jobImage} alt='Job' className='w-16 h-16 object-cover rounded-md' />}
        </div>
        <ReactQuill theme='snow' placeholder='Job Description' className='h-72 mb-12' required onChange={(value) => setFormData((prevData) => ({ ...prevData, jobDescription: value }))} />
        <Button type='submit' gradientDuoTone='purpleToBlue' size='lg'>Publish</Button>
      </form>
    </div>
  );
}
