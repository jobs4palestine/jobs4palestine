import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { queryTableData } from '../api/api';

const TableView: React.FC = () => {
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (selectedSpecialty) {
            queryTableData(selectedSpecialty).then((tableData) => setData(tableData));
        }
    }, [selectedSpecialty]);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
        </div>
    );
};

export default TableView;
