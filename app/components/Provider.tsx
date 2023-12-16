'use client'

import { SessionProvider } from "next-auth/react"
import { FC, ReactNode } from 'react'

interface ProviderProps {
    children: ReactNode
}

/*
This component is used to give client components the ability to access the session
*/
const Provider: FC<ProviderProps> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>
}

export default Provider