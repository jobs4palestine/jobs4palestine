import React, { useEffect } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { queryTableData } from '../api/api';
import { setResultsBySpecialty } from '../store/resultsSlice';
import type { IResultBase } from '@monorepo/shared';

const TableView: React.FC = () => {
    const dispatch = useDispatch();
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const data = useSelector((state: RootState) => selectedSpecialty ? state.results[selectedSpecialty] || [] : []);
    const [loading, setLoading] = React.useState<boolean>(true);

    const columns: ColumnsType<IResultBase> = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Domain', dataIndex: 'domain', key: 'domain' },
        { title: 'Description', dataIndex: 'snippet', key: 'snippet' },
        { title: 'Date Published', dataIndex: 'date_published', key: 'date_published' },
    ];

    useEffect(() => {
        if (selectedSpecialty) {
            setLoading(true);
            queryTableData(selectedSpecialty).then((results) => {
                dispatch(setResultsBySpecialty({ specialty: selectedSpecialty, results }));
                setLoading(false);
            });
        }
    }, [selectedSpecialty, dispatch]);

    return (
        <div>
            <Table<IResultBase>
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.link}
                pagination={{ pageSize: 200 }}
                loading={loading}
            />
        </div>
    );
};

export default TableView;
