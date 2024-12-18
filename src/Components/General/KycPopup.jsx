const KycPopups = ({ isOpen, onClose, title, onRegister }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <p>Please proceed to register as a provider.</p>
          <div className="flex justify-between mt-4">
            <button 
              className="bg-secondary text-white px-4 py-2 rounded" 
              onClick={onRegister}
            >
              Register as Provider
            </button>
            <button 
              className="bg-secondary/45 text-white  px-4 py-2 rounded" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default KycPopups;