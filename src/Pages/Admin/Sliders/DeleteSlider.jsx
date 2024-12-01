import ModalLayout from "../../../Components/Admin/ModalLayout";

const ConfirmDeleteSlider = ({ closeView, confirmAction, isLoading }) => {
  return (
    <>
       <ModalLayout closeView={closeView}>
      <div className="text-center w-4/5 my-6 mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center gap-2">
            <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-current text-pink" role="status"></div>
            <span>Deleting...</span>
          </div>
        ) : (
          "Are you sure you want to delete this User?"
        )}
      </div>
      {!isLoading && (
        <div className="grid grid-cols-2 gap-3 w-11/12 mx-auto mb-5">
          <button
            onClick={closeView}
            className="bg-red-700 py-3 w-20 capitalize font-semibold text-sm rounded-md text-white shadow-xl"
          >
            Cancel
          </button>
          <button
            onClick={confirmAction}
            className="bg-pink py-3 w-20 capitalize font-semibold ml-auto text-sm rounded-md text-white shadow-xl"
          >
            Proceed
          </button>
        </div>
      )}
    </ModalLayout>
    </>
  );
};

export default ConfirmDeleteSlider;
