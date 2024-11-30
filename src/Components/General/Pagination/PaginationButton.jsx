import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReactPaginate from 'react-paginate';

const PaginationButton = ({ pageCount, onPageChange }) => {
    return (
        <div className=''>
            <ReactPaginate
                breakLabel={<span className="mx-1">...</span>}
                nextLabel={
                    <span className="w-10 h-10 flex justify-center text-primary items-center bg-gray hover:bg-pink hover:text-white rounded-md">
                        <FaChevronRight />
                    </span>
                }
                onPageChange={onPageChange}
                pageRangeDisplayed={5}
                pageCount={pageCount} 
                previousLabel={
                    <span className="w-10 h-10 flex justify-center text-primary items-center bg-gray hover:bg-pink hover:text-white rounded-md">
                        <FaChevronLeft />
                    </span>
                }
                renderOnZeroPageCount={null}
                containerClassName="flex items-center justify-center mt-8 mb-4"
                pageClassName="block border-solid flex justify-center text-primary bg-gray mx-1 rounded-md items-center w-10 h-10"
                activeClassName="bg-pink text-white"
            />
        </div>
    );
};

export default PaginationButton;
