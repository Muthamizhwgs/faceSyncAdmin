import React from 'react'

const SuperAdmin = () => {
  return (
    <div className='w-full h-[100vh] bg-slate-600'>
    <div className=' pt-6'>
        <img src={Logo} alt="" className='w-[70%] h-16 m-auto rounded-full'/>
    </div>
    <div className='mt-10'>
        <ul className='flex flex-col w-[80%] m-auto gap-3'>
            <li className={`${location.pathname == '/manage-admin' ?'bg-slate-200 p-2 rounded-md':'' }`}><Link to={'/home'}>Manage Admin</Link></li>
            <li className={`${location.pathname == '/manage-photographer'? 'bg-slate-200 p-2 rounded-md':'' }`}><Link to={'/manage-photographer'}> Manage Photographer </Link></li>
        </ul>
    </div>
</div>
  )
}

export default SuperAdmin