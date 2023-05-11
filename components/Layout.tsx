
import React, { ReactNode } from 'react'
import Navbar from './Navbar/Navbar'

type Props = {
    children: ReactNode | ReactNode[]
}

const Layout = ({ children }: Props) => {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default Layout