import React, { useEffect, useState } from 'react'
import logo from '../assets/facesynclogo.png'

const Home = () => {

    const [ roleLoggedIn, setRoleLoggedIn] = useState('');
    useEffect(()=> {
        // localStorage.setItem("facesyncrole", 1)
        setRoleLoggedIn(localStorage.getItem("facesyncrole"));
        console.log(localStorage.getItem('facesyncrole'))

    })

    const superAdminSidebar = [
        {title: 'admin'},
        {title: 'photographer'}
    ]

    const adminsideBar = [
        {title: 'photographer'}
    ]

    const photographer = [
        {title: 'summa'}
    ]

    return (
        <>
            <section className='flex flex-row'>
                <section className='bg-black w-[15%] h-[100vh]'>

                </section>
                <section className={'w-[85%] h-[100vh]'`${roleLoggedIn==1 ? 'bg-green-500' :null}`}>


                </section>
            </section>
        </>
    )
}

export default Home
