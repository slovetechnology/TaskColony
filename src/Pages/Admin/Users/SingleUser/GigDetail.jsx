import React, { useCallback, useEffect, useState } from 'react';
import ModalLayout from '../../../../Components/Admin/ModalLayout';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';

const GigDetail = ({ gig, closeView }) => {
    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[27rem] pt-1 overflow-hidden scrollsdown">
                <div className="text-xl font-bold">Booking Details</div>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    <div className="">
                        <p className="font-medium text-lg">User</p>
                        <p className="">{gig.ufname} {gig.ulname}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-lg">Service</p>
                        <p className="">{gig.service_name}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-lg">Commission(%)</p>
                        <p className="">{gig.commission_percent}%</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-lg">Amount</p>
                        <p className="">{gig.amt_paid}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-lg">Status</p>
                        <p className="">{gig.status_text}</p>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
};

export default GigDetail;