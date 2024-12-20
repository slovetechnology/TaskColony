import React from 'react'
import Layout from '../../Components/User/Layout'
import { Team } from '../../utils/utils'

const Teams = () => {
    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className='font-[500] text-4xl mb-3'>Team</p>
                    <span className='flex items-center gap-4 font-[500] justify-center'>
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Team</p>
                    </span>
                </div>
            </div>
            <div className="mt-16 mb-20">
                <div className="flex items-center justify-center font-semibold text-3xl">Our Team</div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-16 mt-7">
                    {Team.map((item, i) => (
                        <div key={i} className="">
                            <div className="flex items-center justify-center flex-col">
                                <div className=""> <img src={item.img} alt="" className="" /> </div>
                                <div className="">{item.title}</div>
                                <div className="">{item.position}</div>
                                <div className="text-sm  text-slate-500 break-keep text-center mx-12">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Teams
