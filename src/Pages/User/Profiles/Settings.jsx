import React, { useEffect, useState } from 'react';
import Modal from '../../../Components/General/Modal';
import ToggleButton from '../../../Components/General/toggle-button';
import { useSelector } from 'react-redux';

const Settings = ({ closeview }) => {
  const { user } = useSelector(state => state.data);
  const [displayOnApp, setDisplayOnApp] = useState(user.push_notification === 1);

  // Load initial state from localStorage
  useEffect(() => {
    const storedValue = localStorage.getItem('push_notification');
    if (storedValue !== null) {
      setDisplayOnApp(storedValue === 'true');
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('push_notification', displayOnApp);
  }, [displayOnApp]);

  const handleToggle = () => {
    setDisplayOnApp(prev => !prev);
  };

  return (
    <Modal closeView={closeview}>
      <div className="font-semibold text-lg mb-4">Settings</div>
      <div className="">
        <div className="">Notifications</div>
        <div className="flex mt-5 justify-between">
          <div className="">
            <div className="font-medium">Push Notification</div>
            <div className="text-sm font-medium">Customize Push Notification</div>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <ToggleButton
              checked={displayOnApp}
              onChange={handleToggle}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Settings;