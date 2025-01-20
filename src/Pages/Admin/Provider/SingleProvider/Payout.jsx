import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';
import UpdatePayout from './UpdatePayout';
import { PiPencilSimpleLine } from 'react-icons/pi';

const TABLE_HEADERS = ['id', 'Date', 'Amount', 'Status', ''];
const DEFAULT_PER_PAGE = 10;

const Payouts = ({ trackid }) => {
    const [payout, setPayout] = useState([]); // Set to an empty array
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [view, setView] = useState(false);
    const [singles, setSingles] = useState({});

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.provider_payout}?&provider_tid=${trackid}`);
            if (res.status === true) {
                setPayout(res.data.data);
                setTotal(res.data.total); // Assuming your API returns the total count
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err.message);
        } finally {
            setLoading(false);
        }
    }, [trackid]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const SingleItem = (val) => {
        setSingles(val);
        setView(true);
    };

    const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
        // Optionally, you might want to fetch data again based on the new page
    };

    if (loading) {
        return <div className="text-center">Loading payouts...</div>;
    }

    if (payout.length === 0) {
        return <div className="text-center">No payouts available.</div>;
    }

    return (
        <div>
            {view && (
                <UpdatePayout
                    singles={singles} 
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
                    {payout.map((item, i) => (
                        <TableRow key={i}>
                            <TableData>{item.id}</TableData>
                            <TableData>{item.created_date}</TableData>
                            <TableData>{item.amount}</TableData>
                            <TableData>{item.status}</TableData>
                            <TableData>
                            <div className="flex gap-4 text-lg text-primary">
                                <div className="cursor-pointer" onClick={() => SingleItem(item.id)}>
                                    <PiPencilSimpleLine />
                                </div>
                            </div>
                        </TableData>
                        </TableRow>
                    ))}
                </Table>
            </div>
            <div className="w-full flex justify-center mt-4">
                <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default Payouts;