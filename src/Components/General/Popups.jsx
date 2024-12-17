const Popups = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p>{children}</p>
                <div className="flex justify-end mt-4">
                    <button className="bg-secondary text-white px-4 py-2 rounded" onClick={onClose}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popups;
