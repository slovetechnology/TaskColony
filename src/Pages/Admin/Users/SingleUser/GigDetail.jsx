import React, { useState } from 'react';
import ModalLayout from '../../../../Components/Admin/ModalLayout';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';

const GigDetail = ({ gig, closeView }) => {
    const [image, setImage] = useState({
        main: null,
        preview: null,
    });

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image (JPEG/PNG).');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should not exceed 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage({
                    main: file, // Store the actual file for binary upload
                    preview: reader.result, // Display the image preview
                });
            };
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-full px-3 mx-auto text-primary h-[35rem] pt-1 overflow-hidden scrollsdown">
                <div className="text-xl font-bold">Booking Details</div>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    <div className="">
                        <p className="font-medium text-base">User</p>
                        <p className="text-sm">{gig.ufname} {gig.ulname}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Service</p>
                        <p className="text-sm">{gig.service_name}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Commission(%)</p>
                        <p className="text-sm">{gig.commission_percent}%</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Tax</p>
                        <p className="text-sm">{gig.tax_paid}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Amount Paid</p>
                        <p className="text-sm">{gig.amt_paid}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Profit</p>
                        <p className="text-sm">{gig.profit}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Payment</p>
                        <p className="text-sm">Card</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Date</p>
                        <p className="text-sm">{gig.created_date}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Time</p>
                        <p className="text-sm">{gig.created_time}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Status</p>
                        <p className="text-sm">{gig.status_text}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Used Coupon</p>
                        <p className="text-sm">{gig.used_coupon}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Address</p>
                        <p className="text-sm">{gig.address}</p>
                    </div>
                    <div className="">
                        <p className="font-medium text-base">Description</p>
                        <p className="text-sm">{gig.description}</p>
                    </div>
                </div>
                <div className="my-4">
                    <label>
                        {image.preview === null ? (
                            // Show existing image if available
                            gig.image_url ? (
                                <img
                                    src={gig.image_url} // Replace with the actual field name for the image URL
                                    alt="Gig"
                                    className="w-full h-40 mx-auto border rounded-md object-cover"
                                />
                            ) : (
                                <div className="w-full h-32 bg-slate-200 cursor-pointer mx-auto flex items-center justify-center text-slate-600">
                                    No Image Available
                                </div>
                            )
                        ) : (
                            <img
                                src={image.preview}
                                alt="Preview"
                                className="w-full h-40 mx-auto border rounded-md object-cover"
                            />
                        )}
                        <input onChange={handleUpload} type="file" hidden />
                    </label>
                </div>
            </div>
        </ModalLayout>
    );
};

export default GigDetail;