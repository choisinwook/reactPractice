import React, { useState } from 'react';

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            console.log('API 응답 상태:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            const result = await response.json();
            console.log('API 응답 데이터:', result);
            setData(result);
        } catch (err) {
            console.error('API 호출 에러:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Welcome to My React App</h1>
            <p>This is the main application component.</p>

            <button onClick={fetchData}>조회 API 호출</button>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>에러: {error}</p>}
            {data && (
                <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <h2>{data.title}</h2>
                    <p>{data.body}</p>
                    <small>데이터 ID: {data.id}</small>
                </div>
            )}
        </div>
    );
}

export default App;