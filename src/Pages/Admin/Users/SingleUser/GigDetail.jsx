import React, { useState } from 'react';
import ModalLayout from '../../../../Components/Admin/ModalLayout';

const GigDetail = ({ gig, closeView }) => {
   
    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-full px-3 mx-auto text-primary h-[39rem] pt-1 overflow-hidden scrollsdown">
                <div className="text-xl font-bold">Booking Details</div>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    <div className="">
                        <p className="font-medium text-base mb-2">User</p>
                        <p className="text-sm">{gig.ufname} {gig.ulname}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Service</p>
                        <p className="text-sm">{gig.service_name}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Commission(%)</p>
                        <p className="text-sm">{gig.commission_percent}%</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Tax</p>
                        <p className="text-sm">{gig.tax_paid}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Amount Paid</p>
                        <p className="text-sm">${gig.amt_paid}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Profit</p>
                        <p className="text-sm">{gig.profit}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Payment</p>
                        <p className="text-sm">Card</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Date</p>
                        <p className="text-sm">{gig.created_date}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Time</p>
                        <p className="text-sm">{gig.created_time}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Status</p>
                        <p className="text-sm">{gig.status_text}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Used Coupon</p>
                        <p className="text-sm">{gig.used_coupon}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Address</p>
                        <p className="text-sm">{gig.address}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base mb-2">Description</p>
                        <p className="text-sm">{gig.description}</p>
                    </div>
                </div>
                <div className="my-4">
                <p className="font-medium text-base mb-4">Attachment</p>
                 <img src={gig.imagelinks[0]} alt="" className="w-[15rem]" />
                </div>
            </div>
        </ModalLayout>
    );
};

export default GigDetail;