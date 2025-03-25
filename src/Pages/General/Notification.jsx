import React, { useEffect, useState } from 'react'
import Layout from '../../Components/User/Layout'
import gradient from '../../assets/gradient.jpeg'
import { Apis, AuthGeturl } from '../../Components/General/Api';
import { FaUserCircle } from 'react-icons/fa';
import Modal from '../../Components/General/Modal';

const Notification = ({ closeview }) => {
  const [items, setItems] = useState([]);

  const GetNotify = async () => {
    try {
      const res = await AuthGeturl(Apis.users.all_notification);
      if (res.status === true) {
        setItems(res.data.records);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    GetNotify();
  }, []);

  const Markasread = async () => {
    const res = await AuthGeturl(Apis.users.mark_as_read);
    if (res.status === true) {
      GetNotify();
    }
  }
  // Helper function to format the date
  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };
  return (
    <Modal height='h-[40rem]' closeView={closeview}>
      <div className="font-bold text-2xl mb-4">Notification</div>
      <div className="flex justify-end">
        {/* <button className="bg-secondary px-4 py-2 text-white rounded-lg" onClick={Markasread()}>Mark As Read</button> */}
      </div>
      <div className="mt-6">
        <div>
          {items.map((item, i) => (
            <div key={i} className="flex w-full overflow-y-auto items-start mb-3 gap-4 pb-3 border-b">
              <div className="text-4xl"> <FaUserCircle /> </div>
              <span className="flex-1">
                <h5 className="font-[500] text-sm xl:text-base">{item.notificationtitle}</h5>
                <p className="text-sm text-primary">{item.notificationtext}</p>
              </span>
              <span className="text-xs text-primary">{formatDate(item.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Notification;