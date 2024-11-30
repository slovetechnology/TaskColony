import React, { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'

const ModalLayout = ({ closeView, children }) => {
    const togref = useRef()

    useEffect(() => {
        togref && window.addEventListener('click', (e) => {
            togref.current !== null && !togref.current.contains(e.target) && closeView()
        }, true)
    }, [])
    return (
        <div className='bg-black/60 fixed cartmodal top-0 z-[99] left-0 w-full h-screen flex items-center justify-center'>
            <div className='w-11/12 max-w-xl p-3 bg-white rounded-lg max-h-[80vh] overflow-y-auto overflow-x-hidden scrolls relative' ref={togref}>
                <div className="absolute top-3 right-3 w-fit ml-auto text-xl rounded-full bg-slate-200 text-slate-600 cursor-pointer p-1" onClick={closeView}> <FaTimes /> </div>
                {children}
            </div>
        </div>
    )
}

export default ModalLayout