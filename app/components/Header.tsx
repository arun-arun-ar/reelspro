"use client"
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Header = () => {
    //extract data form next-auth 
    const {data:session} = useSession()


    const handleSignOut  = async ()=>{
        try {
            await signOut()
        } catch (error) {
            
        }
    }
  return (
    <div>Header</div>
  )
}

export default Header