import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Apis, AuthPosturl } from "../../../Components/General/Api";
import Modal from "../../../Components/General/Modal";

const ProviderWithdraw = ({ closeView }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Request Withdraw");
  const [view, setView] = useState(1)
  const onSubmit = async (data) => {
    const datatosend = {
      amount: data.amount
    };
    setButtonText("Requesting...");

    const res = await AuthPosturl(Apis.users.withdraw_funds, datatosend);

    if (res.status === true) {
      setView(2)
    } else {
      console.error("Error funding wallet:", res.error);
      setButtonText("Try Again");
    }
  };

  return (
    <Modal closeView={closeView}>
      <div className="font-semibold text-lg mb-4">Request Withdraw</div>
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

export default ProviderWithdraw
