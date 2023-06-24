import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav";
import ToasterProvider from "@/providers/ToasterProvider";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}) {
    const { data: session } = useSession()
    const [showMobileNav, setShowMobileNav] = useState(false);

    if (!session) {
        return (
            <div className="bg-bgColor w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <button onClick={() => signIn('google')} className="bg-gray-200 p-2 px-4 rounded-lg">
                        Login with Google
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-bgColor min-h-screen">
        <div className="md:hidden flex items-center p-4">
            <button onClick={() => setShowMobileNav(!showMobileNav)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <div className="flex flex-grow justify-center mr-6">
                <Logo />
            </div>
        </div>
        <div className="flex">
            <ToasterProvider />
                <Nav show={showMobileNav} />
                <div className="flex-grow p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
