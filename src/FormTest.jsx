import React from 'react'
import { useForm } from 'react-hook-form'

const csinput = 'w-full p-3 rounded-md border outline-none'
export default function FormTest() {

    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm({
        defaultValues: {
            firstname: 'John',
            email: '',
            gender: '',
            agree: true,
            complexion: '',
        }
    })

    const watchForm = watch([
        "gender",
        "firstname"
    ])
    function HandleGender(e) {
        const value = e.target.value 
        if(value === 'male') return setValue("complexion", "Dark")
        if(value === 'female') return setValue("complexion", "Fair")
    }
  return (
    <div className='w-11/12 max-w-4xl mx-auto border rounded-lg p-5'>
      <form onSubmit={handleSubmit()} className='flex flex-col gap-3'>
      <input {...register('firstname', {required: 'first name is required'})} type="text" className={`${csinput} ${errors.firstname ? 'border-red-600' : 'border'}`} />
      {errors.firstname && <div className="text-red-600">{errors.firstname.message}</div> }

      <input {...register('email', {
        required: 'Email is required',
        validate: (value) => {
            if(!value.includes('@'))return 'Enter a valid email address'
            if(!value.includes('gmail'))return 'Enter only gmail addresses'
        }
      })} type="email" className={csinput} />
      {errors.email && <div className="text-red-600">{errors.email.message}</div> }

      <select {...register('gender', {required: 'Gender is required'})} onChange={HandleGender} className={csinput}>
        <option value="">--Select--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {errors.gender && <div className="text-red-600">{errors.gender.message}</div> }
      <div className="">Complexion: {watchForm[0] === 'female' ? 'Fair' : watchForm[0] === 'male' ? 'Dark' :''}</div>
      <div className="">
        <label>
        <input {...register('agree')} type="checkbox" className="" /> Agree
        </label>
      </div>
      <button className='bg-blue-500 py-3 px-5 rounded-lg text-white'>submit</button>
      </form>
    </div>
  )
}
