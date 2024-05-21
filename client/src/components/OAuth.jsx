import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try{
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch ('/api/auth/google',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: resultFromGoogle.user.displayName,
                                     email: resultFromGoogle.user.email,
                                    googlePhotoUrl: resultFromGoogle.user.photoURL,}),           
        })
        const data = await res.json();
        if(res.ok){
            dispatch(signInSuccess(data))
            navigate('/')
        }
      }
        catch(error){
            console.log(error);
        }
    };
  return (
    <Button
      type='button'
      outline
      className='mt-4 text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  );
}
