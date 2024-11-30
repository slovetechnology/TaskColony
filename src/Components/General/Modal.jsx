import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  closeView,
  children,
  width = 'max-w-xl',
  height = 'h-[20rem]',
  overlayColor = 'bg-black/60',
  closeButton = true,
  padding = 'p-6', // Add a padding prop with a default value
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeView();
      }
    };

    // Disable body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('click', handleClickOutside, true);
    
    return () => {
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
      window.removeEventListener('click', handleClickOutside, true);
    };
  }, [closeView]);

  return (
    <div
      className={`${overlayColor} fixed top-0 z-[99] left-0 w-full h-screen flex items-center  justify-center`}
    >
      <div
        ref={modalRef}
        className={`w-11/12 ${width} ${padding} bg-white rounded-lg ${height} overflow-y-auto overflow-x-hidden scrollsdown relative`}
        role="dialog"
        aria-modal="true"
      >
        {closeButton && (
          <button
            className="absolute top-3 right-3 text-xl rounded-full bg-slate-200 text-slate-600 cursor-pointer p-2 hover:bg-slate-300"
            onClick={closeView}
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;