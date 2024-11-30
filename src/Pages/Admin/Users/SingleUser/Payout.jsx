import React from 'react'

const Payout = () => {
    return (
        <AdminLayout>
            <div className="m-10">
                <div className="grid grid-cols-4 mt-8 gap-5">
                    <div>
                        <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
                            <p className="text-base">Total Earned</p>
                            <div className="flex mt-5 items-center justify-between">
                                <p className="text-5xl font-medium ">10</p>
                                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                    <GoArrowUpRight />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#3626E3] to-[#72FF13]">
                            <p className="text-base">Total Completed Gigs</p>
                            <div className="flex mt-5 items-center justify-between">
                                <p className="text-5xl font-medium ">32</p>
                                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                    <GoArrowUpRight />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FF3D3D] to-[#FFBC0A]">
                            <p className="text-base">Total Gigs Reviews</p>
                            <div className="flex mt-5 items-center justify-between">
                                <p className="text-5xl font-medium ">12</p>
                                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                    <GoArrowUpRight />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 to-[#FF3D3D] from-[#FFBC0A]">
                        <p className="text-base">Wallet Balance</p>
                        <div className="flex mt-5 items-center justify-between">
                            <p className="text-5xl font-medium ">12</p>
                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                <GoArrowUpRight />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <div className="bg-white px-6 py-6">
                        <div className="flex gap-8 text-lg border-b text-primary">
                            <Link to='' className=''>About</Link>
                            <Link to='' className=''>My Gigs</Link>
                            <Link to='' className=''>My Gigs Review</Link>
                            <Link to='' className=''>Bookings</Link>
                            <Link to='' className=''>Reviews</Link>
                            <Link to='' className=''>Documents</Link>
                            <Link to='' className=''>Payout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Payout
