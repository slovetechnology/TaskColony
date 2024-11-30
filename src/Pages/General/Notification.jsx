import React, { useEffect, useState } from 'react'
import Layout from '../../Components/User/Layout'
import gradient from '../../assets/gradient.jpeg'
import { Apis, AuthGeturl } from '../../Components/General/Api';
import { FaUserCircle } from 'react-icons/fa';

const notify = [
  {name: 'Cleaner job request', message: 'Toby Quay has accepted your job request ' },
  {name: 'TV installation request', message: 'Toby Quay has accepted your job request ' },
  {name: 'Furniture assembly request', message: 'Toby Quay has accepted your job request ' },
  {name: 'Baby prep request', message: 'Toby Quay has accepted your job request ' },
  {name: ' Yardwork Services request', message: 'Toby Quay has accepted your job request ' },
  {name: ' Furniture Assembly request', message: 'Toby Quay has accepted your job request ' },
  {name: ' Shopping & Delivery request', message: 'Toby Quay has accepted your job request ' },
]

const Notification = () => {
  const [items, setItems] = useState()
  const GetNotify = async () => {
    try {
      const res = await AuthGeturl(Apis.users.all_notification)
      if (res.status === true) {
        setItems(res.data)
      }
    } catch (error) {

    }
  }
  useEffect(() => {GetNotify()}, [])
  return (
    <Layout>
    <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className='font-[500] text-4xl mb-3'>Notifications</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Notifications</p>
          </span>
        </div>
      </div>

      <div className="xl:w-[80%] w-full px-5 xl:px-0 my-20 mx-auto">
        <div className="border">
          <img src={gradient} alt="" className="h-16 w-full rounded-tl-xl rounded-tr-xl" />
          <div className="bg-white w-full px-10 py-5 h-[32rem] shadow-2xl overflow-y-auto scrollsdown">
            {notify.map((item, i) => (
              <div key={i} className="flex items-start mb-3 gap-4 pb-3 border-b last:border-none">
                <div className="text-4xl"> <FaUserCircle /> </div>
                <span className="flex-1">
                  <h5 className="font-[500] text-sm xl:text-base">{item.name}</h5>
                  <p className="text-sm text-primary">{item.message}</p>
                  <div className="flex gap-7 text-sm mt-4">
                    <div className="text-primary cursor-pointer">Dismiss</div>
                    <div className="text-secondary cursor-pointer">View</div>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Notification;
