import React, { useEffect, useState } from 'react'
import Layout from '../../Components/User/Layout'
import gradient from '../../assets/gradient.jpeg'
import { Apis, AuthGeturl } from '../../Components/General/Api';
import { FaUserCircle } from 'react-icons/fa';
import Modal from '../../Components/General/Modal';


const Notification = ({ closeview }) => {
  const [items, setItems] = useState([])
  const GetNotify = async () => {
    try {
      const res = await AuthGeturl(Apis.users.all_notification)
      if (res.status === true) {
        setItems(res.data.records)
      }
    } catch (error) {

    }
  }
  useEffect(() => { GetNotify() }, [])
  return (
    <Modal height='' closeView={closeview}>
      <div className="font-bold text-2xl">Notification</div>
      <div className="mt-10">
        <div className="w-full overflow-y-auto scrollsdown">
          {items.map((item, i) => (
            <div key={i} className="flex items-start mb-3 gap-4 pb-3 border-b">
              <div className="text-4xl"> <FaUserCircle /> </div>
              <span className="flex-1">
                <h5 className="font-[500] text-sm xl:text-base">{item.notificationtitle}</h5>
                <p className="text-sm text-primary">{item.notificationtext}</p>

              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default Notification;
