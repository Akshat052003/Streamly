import { Loader } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='min-h-screen flex justify-center items-center'>
        <Loader className='animate-spin text-primary size-10'/>

    </div>
  )
}

export default PageLoader