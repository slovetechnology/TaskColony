import React, { useState } from 'react';
import Modal from '../../../../Components/General/Modal';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl } from '../../../../Components/General/Api';
import { useNavigate } from 'react-router-dom';

const FundWallet = ({ closeview }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Fund Wallet");

  const onSubmit = async (data) => {
    const datatosend = {
      amount: data.amount
    };
    setButtonText("Funding...");

    const res = await AuthPosturl(Apis.users.fund_wallet, datatosend);
    
    if (res.status === true) {
      window.location.href = res.text; 
    } else {
      console.error("Error funding wallet:", res.error);
      setButtonText("Try Again"); 
    }
  };

  return (
    <Modal closeView={closeview}>
      <div className="font-semibold text-lg mb-4">Fund Wallet</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Amount</label>
            <input
              {...register('amount', { required: 'Amount is required' })}
              type="text"
              className={`input border ${errors.amount ? 'border-red-600' : 'border-gray-300'}`}
            />
            {errors.amount && <div className="text-red-600">{errors.amount.message}</div>}
          </div>
          <button 
            type="submit" 
            className="bg-secondary text-white py-1 px-2 rounded-md mt-5"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default FundWallet;