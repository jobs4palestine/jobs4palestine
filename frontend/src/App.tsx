import React, { useState } from 'react';
import {Input, Table, Select, Checkbox, CheckboxOptionType} from 'antd';
import axios from 'axios';
import './App.css';
import { ColumnsType } from 'antd/es/table';
import { CSSProperties } from 'react';

interface SearchResult {
    title: string;
    link: string;
    domain: string;
    snippet: string;
    date_published?: string;
}

// Define the proper type for cell style
type CellStyle = {
    style: CSSProperties;
}

const { Search } = Input;
const { Option } = Select;

const jobSites = [
    "jobs.ashbyhq.com",
    "join.com",
    "jobs.lever.co",
    "boards.greenhouse.io",
    "wd5.myworkdayjobs.com",
    "jobs.lever.co",
    "careers.icims.com",
    "jobs.jobvite.com",
    "jobs.smartrecruiters.com",
    "app.breezy.hr",
    "jazzhr.com",
    "taleo.net",
    "oraclecloud.com",
    "recruiting.adp.com"
];


function App() {
    const [query, setQuery] = useState('');
    const [sites, setSites] = useState<string[]>(jobSites);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [filteredDomain, setFilteredDomain] = useState<string | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value: string) => {
        console.log('searching ' + value);
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/search', {
                params: {
                    q: value,
                    sites: sites.join(','),
                },
            });
            console.log(response.data);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = filteredDomain
        ? results.filter((res) => res.domain.includes(filteredDomain))
        : results;


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
                    wordBreak: 'break-word'
                } as CSSProperties
            })
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            onCell: (): CellStyle => ({
                style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                } as CSSProperties
            })
        },
        {
            title: 'Snippet',
            dataIndex: 'snippet',
            key: 'snippet',
            onCell: (): CellStyle => ({
                style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                } as CSSProperties
            })
        },
        {
            title: 'Date Published',
            dataIndex: 'date_published',
            key: 'date_published'
        }
    ];

    const checkboxOptions: CheckboxOptionType[] = columns.map((col) => ({
        label: col.title as string, // Cast the title to string
        value: col.key as string,   // Cast the key to string
    }));

    const displayedColumns = columns.filter(
        (col) => !hiddenColumns.includes(col.key as string)
    );

    const domainOptions = Array.from(new Set(results.map((res) => res.domain)));

    const onColumnChange = (checkedValues: any) => {
        setHiddenColumns(checkedValues);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Search
                placeholder="Enter search keywords"
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
            />

            <div style={{ marginTop: 20 }}>
                <Select
                    placeholder="Filter by domain"
                    style={{ width: 200, marginRight: 20 }}
                    onChange={(value) => setFilteredDomain(value)}
                    allowClear
                >
                    {domainOptions.map((domain) => (
                        <Option key={domain} value={domain}>
                            {domain}
                        </Option>
                    ))}
                </Select>

                <Checkbox.Group
                    options={checkboxOptions}
                    onChange={onColumnChange}
                    style={{ marginLeft: 20 }}
                />
                <span style={{ marginLeft: 10 }}>Hide Columns</span>
            </div>

            <Table<SearchResult>
                dataSource={filteredResults}
                columns={displayedColumns}
                rowKey={(record) => record.link}
                style={{ marginTop: 20 }}
                pagination={{ pageSize: 200 }}
                loading={loading}
            />
        </div>
    );
}

export default App;
