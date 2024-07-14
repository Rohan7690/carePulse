"use client"
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from '@/lib/utils';
  
const PassKeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [open,setOpen] = useState(true);
    const [passkey,setPasskey] = useState('');
    const [error,setError] = useState('');

    const closeModal = () =>{
        router.push('/');
        setOpen(false);
    }

    const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path)
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
  }, [encryptedKey]);

    const validatePasskey = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) =>{
        e.preventDefault();
        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            const encryptedKey = encryptKey(passkey);
            localStorage.setItem('accessKey',encryptedKey);
            setOpen(false);
        }else{
            setError('Invalid passkey. Please try again.');
        }
    }
    
  return (

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className='shad-alert-dialog'>
                    <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-start justify-between'>
                        Admin access verification
                        <Image
                            src="/assets/icons/close.svg"
                            height={20}
                            width={20}
                            onClick={()=>closeModal()}
                            alt='close'
                            className='cursor-pointer'
                            />
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Please enter the passkey to access the admin page
                    </AlertDialogDescription>
                    <InputOTP maxLength={6} value={passkey} onChange={(value)=>{setPasskey(value)}}>
                        <InputOTPGroup className='shad-otp'>
                            <InputOTPSlot className='shad-otp-slot' index={0} />
                            <InputOTPSlot className='shad-otp-slot' index={1} />
                            <InputOTPSlot className='shad-otp-slot' index={2} />
                            <InputOTPSlot className='shad-otp-slot' index={3} />
                            <InputOTPSlot className='shad-otp-slot' index={4} />
                            <InputOTPSlot className='shad-otp-slot' index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {error && <p className='shad-error text-14-regular mt-4 flex justify-center'>{error}</p>}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={(e)=>
                        validatePasskey(e)} className='shad-primary-btn w-full'>Enter Admin Panel</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>

  )
}

export default PassKeyModal