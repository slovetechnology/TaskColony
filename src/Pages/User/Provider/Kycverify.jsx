import React from 'react'
import Modal from '../../../Components/General/Modal'
import { useSelector } from 'react-redux';
import { FcApproval } from 'react-icons/fc';

const Kyc = ({ closeView }) => {
    const { user } = useSelector((state) => state.data);

    return (
        <Modal closeView={closeView}>
            <div className="font-semibold text-lg mb-4">Kyc Data</div>

            <div className=" mt-16">
                {user.kyclevel === 1 && (
                    <div className="flex items-center flex-col justify-center">
                           <div className="text-[4rem]"> <FcApproval /></div>
                            <div className="text-xl font-medium">Your KYC Is Approved</div>

                    </div>
                )}
            </div>
        </Modal>
    )
}

export default Kyc
