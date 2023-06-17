"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProviders() {
    return (
        <Toaster 
            toastOptions={{
                style: {
                    background: 'white',
                    color: '#880808'
                }
            }}
        />
    )
}
