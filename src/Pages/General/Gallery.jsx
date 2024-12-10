import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../Components/User/Layout'
import { Apis, Geturl } from '../../Components/General/Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllHome = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Geturl(Apis.users.get_system);
            if (res.status === true) {
                
                setGallery(res.data.gallery_images);

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className='font-[500] text-4xl mb-3'>Work Gallery</p>
                    <span className='flex items-center gap-4 font-[500] justify-center'>
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Work Gallery</p>
                    </span>
                </div>
            </div>
            <div className="my-20">
                <div className="w-11/12 mx-auto lg:w-10/12">
            
                    <div className="mt-8 overflow-x-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3">
                            {gallery.map((item, index) => (
                                <LazyLoadImage key={index} src={item} className='h-[15rem] w-[20rem] object-cover' effect='blur' />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Gallery
