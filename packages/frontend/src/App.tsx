import { useState, useEffect } from 'react';
import { Typography, Spin, Alert } from 'antd';
import { getHelloMessage } from './api/hello';

const { Title } = Typography;

function App() {
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await getHelloMessage();
                setMessage(response.message);
            } catch (err) {
                setError('Failed to fetch message from server');
            } finally {
                setLoading(false);
            }
        };

        fetchMessage();
    }, []);

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Title level={2}>{message}</Title>
        </div>
    );
}

export default App;
