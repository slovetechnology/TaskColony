import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';

const TABLE_HEADERS = ["Name",'Id Type', 'Number', 'Gender', "Company Name", 'Status', ''];
const DEFAULT_PER_PAGE = 10;

const ProviderDocuments = () => {
    const { userid } = useParams();
    const [user, setUser] = useState(null);
    const [trackid, setTrackid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0); // Initialize total

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider_detail}?userid=${userid}`);
            if (res.status === true) {
                setUser(res.data.kyc_data[0]); // Access the first item in the array
                setTrackid(res.data.trackid);
                setTotal(res.data.total_bookings); // Set the total for pagination
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err.message);
        } finally {
            setLoading(false);
        }
    }, [userid]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);
    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (!user) {
        return <div>No user data available.</div>; // Handle no user data case
    }

    return (
        <div className="">
            <div className="flex items-start mb-10 justify-start">
                <Table
                    headers={TABLE_HEADERS}
                    className="bg-white"
                    pageCount={pageCount}
                >
                    <TableRow>
                        <TableData>{user.fullname}</TableData>
                        <TableData>{user.sostype}</TableData>
                        <TableData>{user.identity_number}</TableData>
                        <TableData>{user.gender}</TableData>
                        <TableData>{user.companyname}</TableData>
                        <TableData>{user.status}</TableData>
]
                        <TableData></TableData>
                    </TableRow>
                    <div className="w-full flex justify-center mt-4">
                        <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
                    </div>
                </Table>
            </div>
        </div>
    );
};

export default ProviderDocuments;