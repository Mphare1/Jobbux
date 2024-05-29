import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';


export default function CreateJob() {
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log('ReactQuill Component Mounted');
  }, []);

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
          />
          <Select>
            <option value="uncategorized">Select Type</option>
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
            <option value="temporary">Temporary</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
            <option value="volunteer">Volunteer</option>
            <option value="seasonal">Seasonal</option>
            <option value="hybrid">Hybrid</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center sm:flex-row justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' id='jobImage' accept='image/*' />
          <Button gradientDuoTone='purpleToBlue' size='sm' outline>Upload Image</Button>
        </div>
      </form>
    </div>
  );
}
