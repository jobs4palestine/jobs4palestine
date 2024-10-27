import React, { useEffect, useState } from 'react';
import { Table, FloatButton, Button, message, Card } from 'antd';
import { SyncOutlined, ExclamationCircleOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { searchSpecialityJobs, viewSpecialityJobs, archiveSpecialityJob } from '../api/api';
import { setResultsBySpecialty } from '../store/resultsSlice';
import type { APIResult } from '@monorepo/shared';
import dayjs from 'dayjs';

const TableView: React.FC = () => {
    const dispatch = useDispatch();
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const data = useSelector((state: RootState) => selectedSpecialty ? state.results[selectedSpecialty] || [] : []);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterArchived, setFilterArchived] = useState(false);
    const userType = localStorage.getItem('userType');

    const filteredData = filterArchived ? data.filter((item) => !item.archived) : data;

    const columns: ColumnsType<APIResult> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: APIResult) => (
                <a href={record.link} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        { title: 'Domain', dataIndex: 'domain', key: 'domain' },
        { title: 'Description', dataIndex: 'snippet', key: 'snippet' },
        {
            title: 'Date Published',
            dataIndex: 'date_published',
            key: 'date_published',
            render: (date: string) => {
                const publishedDate = dayjs(date);
                const daysAgo = dayjs().diff(publishedDate, 'day');
                return `${publishedDate.format('YYYY-MM-DD')} (${daysAgo} days ago)`;
            },
        },
    ];

    if (userType === 'admin') {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120, // Fixed width for the Actions column
            render: (_, record) => (
                <Button
                    type={record.archived ? 'default' : 'primary'}
                    icon={record.archived ? <ExclamationCircleOutlined /> : <DeleteOutlined />}
                    danger={!record.archived} // Make the button red if not archived
                    onClick={() => handleArchiveClick(record._id, record.archived)}
                >
                    {record.archived ? 'Unarchive' : 'Archive'}
                </Button>
            ),
        });
    }

    useEffect(() => {
        if (selectedSpecialty) {
            setLoading(true);
            viewSpecialityJobs(selectedSpecialty).then((results) => {
                dispatch(setResultsBySpecialty({ specialty: selectedSpecialty, results }));
                setLoading(false);
            });
        }
    }, [selectedSpecialty, dispatch]);

    const handleSearchClick = async () => {
        if (!selectedSpecialty) return;

        setLoading(true);
        try {
            const results = await searchSpecialityJobs(selectedSpecialty);
            dispatch(setResultsBySpecialty({ specialty: selectedSpecialty, results }));
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveClick = async (objectId: string, archived: boolean) => {
        if (selectedSpecialty) {
            setLoading(true);
            try {
                await archiveSpecialityJob(objectId, archived);
                message.success(`Item has been ${archived ? 'unarchived' : 'archived'}.`);
                // Update specific item in the state
                const updatedResults = data.map((item) =>
                    item.link === objectId ? { ...item, archived: archived } : item
                );
                dispatch(setResultsBySpecialty({ specialty: selectedSpecialty, results: updatedResults }));
            } catch (error) {
                message.error(`Failed to ${archived ? 'unarchive' : 'archive'} the item.`);
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleFilterArchived = () => {
        setFilterArchived((prev) => !prev);
    };

    return (
        <Card style={{ margin: 24, padding: 16 }}>
            <Table<APIResult>
                dataSource={filteredData}
                columns={columns}
                rowKey={(record) => record.link}
                pagination={{ pageSize: 200 }}
                loading={loading}
            />
            {userType === 'admin' && (
                <FloatButton.Group style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
                    <FloatButton icon={<SyncOutlined />} onClick={handleSearchClick} />
                    <FloatButton
                        icon={<FilterOutlined />}
                        type={filterArchived ? 'primary' : 'default'}
                        onClick={toggleFilterArchived}
                    />
                </FloatButton.Group>
            )}
        </Card>
    );
};

export default TableView;
