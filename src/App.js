import React, { useEffect, useState } from 'react';

function App() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [size] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = async (currentPage = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts?page=${currentPage}&size=${size}`);
            console.log('API 응답 상태:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            const result = await response.json();
            console.log('API 응답 데이터:', result);
            setPosts(result.content || []);
            setTotal(result.total || 0);
            setPage(result.page || currentPage);
        } catch (err) {
            console.error('API 호출 에러:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async () => {
        if (!newPost.title.trim() || !newPost.body.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }

            const result = await response.json();
            console.log('게시글 작성 응답:', result);

            // 성공 시 폼 초기화하고 목록 새로고침
            setNewPost({ title: '', body: '' });
            alert('게시글이 성공적으로 작성되었습니다!');
            fetchPosts(page); // 현재 페이지 새로고침
        } catch (err) {
            console.error('게시글 작성 에러:', err);
            alert('게시글 작성에 실패했습니다: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchPosts(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(total / size));

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem' }}>
            <h1>게시판</h1>
            <p>페이지 단위로 게시글을 조회할 수 있는 간단한 게시판입니다.</p>

            {/* 게시글 작성 폼 */}
            <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '2rem' }}>
                <h2>새 게시글 작성</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                        disabled={submitting}
                    />
                    <textarea
                        placeholder="내용을 입력하세요"
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
                        disabled={submitting}
                    />
                </div>
                <button onClick={createPost} disabled={submitting}>
                    {submitting ? '작성 중...' : '게시글 작성'}
                </button>
            </div>

            {/* 페이지네이션 */}
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => setPage(1)} disabled={page === 1 || loading}>
                    처음
                </button>{' '}
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1 || loading}>
                    이전
                </button>{' '}
                <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages || loading}>
                    다음
                </button>{' '}
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages || loading}>
                    마지막
                </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <strong>현재 페이지:</strong> {page} / {totalPages}{' '}
                <strong>전체 게시글:</strong> {total}
            </div>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>에러: {error}</p>}

            {!loading && posts.length === 0 && <p>게시글이 없습니다.</p>}

            {posts.map((post) => (
                <div key={post.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>게시글 ID: {post.id}</div>
                </div>
            ))}
        </div>
    );
}

export default App;