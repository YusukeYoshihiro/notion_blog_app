
import React, { ReactNode } from 'react'
import Navbar from './Navbar/Navbar'
import { NextPage } from 'next'

type LayoutProps = {
  children: ReactNode | ReactNode[]
}

const Layout: NextPage<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout