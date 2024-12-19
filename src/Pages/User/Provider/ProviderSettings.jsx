import React from 'react'
import Layout from '../../../Components/User/Layout'

const ProviderSettings = () => {
    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className='font-[500] text-4xl mb-3'>Settings</p>
                    <span className='flex items-center gap-4 font-[500] justify-center'>
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Setting</p>
                    </span>
                </div>
            </div>

        </Layout>
    )
}

export default ProviderSettings
