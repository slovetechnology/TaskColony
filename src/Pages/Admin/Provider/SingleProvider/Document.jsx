import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';
import { PiPencilSimpleLine } from 'react-icons/pi';
import UpdateDocument from './UpdateDocument';

const TABLE_HEADERS = ["Name", 'Id Type', 'Number', 'Gender', "Company Name", 'Status', ''];
const DEFAULT_PER_PAGE = 10;

// Status mapping
const statusMapping = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Processing',
};

const ProviderDocuments = () => {
    const { userid } = useParams();
    const [user, setUser] = useState(null);
    const [trackid, setTrackid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(false);
    const [singles, setSingles] = useState({});

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider_detail}?userid=${userid}`);
            if (res.status === true) {
                setUser(res.data.kyc_data[0]);
                setTrackid(res.data.trackid);
                setTotal(res.data.total_bookings);
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
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data available.</div>;
    }

    const SingleItem = (val) => {
        setSingles(val);
        setView(true);
    };

    return (
        <div className="">
            {view && (
                <UpdateDocument
                    singles={singles}
                    trackid={trackid} // Pass trackid to UpdateDocument
                    resendSignal={() => fetchUser()}
                    closeView={() => setView(false)}
                />
            )}
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
                        <TableData>{statusMapping[user.status] || 'Unknown'}</TableData> {/* Display status text */}
                        <TableData>
                            <div className="flex gap-4 text-lg text-primary">
                                <div className="cursor-pointer" onClick={() => SingleItem(user)}>
                                    <PiPencilSimpleLine />
                                </div>
                            </div>
                        </TableData>
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