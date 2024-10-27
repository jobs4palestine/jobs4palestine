import React, { useEffect } from 'react';
import { Table, FloatButton } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {searchSpecialityJobs, viewSpecialityJobs} from '../api/api';
import { setResultsBySpecialty } from '../store/resultsSlice';
import type { IResultBase } from '@monorepo/shared';

const TableView: React.FC = () => {
    const dispatch = useDispatch();
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const data = useSelector((state: RootState) => selectedSpecialty ? state.results[selectedSpecialty] || [] : []);
    const [loading, setLoading] = React.useState<boolean>(true);
    const userType = localStorage.getItem('userType');

    const columns: ColumnsType<IResultBase> = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Domain', dataIndex: 'domain', key: 'domain' },
        { title: 'Description', dataIndex: 'snippet', key: 'snippet' },
        { title: 'Date Published', dataIndex: 'date_published', key: 'date_published' },
    ];

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

    return (
        <div>
            <Table<IResultBase>
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.link}
                pagination={{ pageSize: 200 }}
                loading={loading}
            />
            {userType === 'admin' && (
                <FloatButton.Group style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
                    <FloatButton icon={<SyncOutlined />} onClick={handleSearchClick} />
                </FloatButton.Group>
            )}
        </div>
    );
};

export default TableView;
