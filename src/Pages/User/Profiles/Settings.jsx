import React from 'react'
import Modal from '../../../Components/General/Modal'
import ToggleButton from '../../../Components/General/toggle-button'
import { useForm } from 'react-hook-form'

const Settings = ({ closeview, resendSignal }) => {
  const { register, handleSubmit, setValue, watch } = useForm({})

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
              checked={watch('displayonapp')}
              onChange={() => setValue('displayonapp', !watch('displayonapp'))}
            />
          </div>
        </div>
        <div className="flex mt-5 justify-between">
          <div className="">
            <div className="font-medium ">Push Notification</div>
            <div className="text-sm font-medium">Customize Push Notification</div>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <ToggleButton
              checked={watch('displayonapp')}
              onChange={() => setValue('displayonapp', !watch('displayonapp'))}
            />
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default Settings
