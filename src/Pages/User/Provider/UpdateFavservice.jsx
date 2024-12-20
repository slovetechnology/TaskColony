import React from 'react'
import Modal from '../../../Components/General/Modal'
import { useSelector } from 'react-redux';
import { FcApproval } from 'react-icons/fc';

const UpdateFavservice = ({ closeView }) => {
    const { user } = useSelector((state) => state.data);

    return (
        <Modal closeView={closeView}>
            <div className="font-semibold text-lg mb-4">Kyc Submitted</div>

            <div className="">
                {user.kyclevel === 1 && (
                    <div className="">
                        <div className="">Kyc Submitted</div>
                        <FcApproval />
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default UpdateFavservice
