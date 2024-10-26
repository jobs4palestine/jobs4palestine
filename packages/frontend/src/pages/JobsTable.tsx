import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { queryTableData } from '../api/api';
import { SearchResult } from '../types/SearchResult'; // Define the SearchResult type in types

interface CellStyle {
    style: React.CSSProperties;
}

const TableView: React.FC = () => {
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const [data, setData] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Define the columns as per the provided structure
    const columns: ColumnsType<SearchResult> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: SearchResult) => (
                <a href={record.link} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
            onCell: (): CellStyle => ({
                style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                },
            }),
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            onCell: (): CellStyle => ({
                style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                },
            }),
        },
        {
            title: 'Snippet',
            dataIndex: 'snippet',
            key: 'snippet',
            onCell: (): CellStyle => ({
                style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                },
            }),
        },
        {
            title: 'Date Published',
            dataIndex: 'date_published',
            key: 'date_published',
        },
    ];

    useEffect(() => {
        if (selectedSpecialty) {
            setLoading(true);
            queryTableData(selectedSpecialty)
                .then((tableData) => {
                    setData(tableData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching table data:', error);
                    setLoading(false);
                });
        }
    }, [selectedSpecialty]);

    return (
        <div>
            <h2>{selectedSpecialty} Table View</h2>
            <Table<SearchResult>
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.link}
                style={{ marginTop: 20 }}
                pagination={{ pageSize: 200 }}
                loading={loading}
            />
        </div>
    );
};

export default TableView;
