// src/pages/TableView.tsx

import React from 'react';
import { Table } from 'antd';

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Specialty', dataIndex: 'specialty', key: 'specialty' },
];

const data = [
    { key: '1', name: 'John Doe', specialty: 'Java' },
    { key: '2', name: 'Jane Smith', specialty: 'Python' },
    { key: '3', name: 'Alice Johnson', specialty: 'React' },
    { key: '4', name: 'Robert Brown', specialty: 'Node.js' },
];

const JobsTable: React.FC = () => (
    <div>
        <h2>Table View</h2>
        <Table columns={columns} dataSource={data} pagination={false} />
    </div>
);

export default JobsTable;
