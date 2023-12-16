import { getServerSession } from "next-auth";
import SignOut from "./SignOut";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function NavBar() {
    const session = await getServerSession(authOptions)

    return (
        <nav className="flex items-center bg-gray-800 p-3 flex-wrap">
            <Link href="/" className="p-2 mr-4 inline-flex items-center">
                <span className="text-xl text-white font-bold uppercase tracking-wide"
                >CookMate</span
                >
            </Link>
            <div
                className="hidden top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto"
                id="navigation"
            >
                <div
                    className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto"
                >
                    {session?.user && <Link
                        href={'/create-recipe'}
                        className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
                    >
                        <span>Create Recipe</span>
                    </Link>}

                    <Link
                        href="/"
                        className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
                    >
                        <span>Search</span>
                    </Link>

                    {!session?.user && <Link
                        href={'/register-user'}
                        className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
                    >
                        <span>Register</span>
                    </Link>}

                    {session?.user ? <SignOut /> : <Link
                        className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        href={'/api/auth/signin'}>Sign In</Link>}
                </div>
            </div>
        </nav>
    )
}