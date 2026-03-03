"use client";

import { useState, useEffect, useRef } from 'react';
import { getMediaFiles, deleteMediaFile, uploadMediaFile } from '@/lib/actions/media-actions';
import { Trash2, Copy, ExternalLink, RefreshCw, FileImage, Upload, Plus } from 'lucide-react';

export default function MediaLibrary() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copying, setCopying] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        setLoading(true);
        const data = await getMediaFiles();
        setFiles(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadMediaFile(formData);
        if (res.success) {
            fetchFiles();
        } else {
            alert(res.error || 'Upload thất bại');
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatSize = (bytes: number) => {

        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopying(url);
        setTimeout(() => setCopying(null), 2000);
    };

    const handleDelete = async (name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa file ${name}?`)) {
            const res = await deleteMediaFile(name);
            if (res.success) {
                fetchFiles();
            } else {
                alert('Xóa thất bại');
            }
        }
    };

    return (
        <div className="media-library-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileImage /> Kho Media (Public)
                </h1>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#FFD700',
                            color: '#000',
                            border: '1px solid #c5a000',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        <Upload size={16} className={uploading ? 'animate-spin' : ''} />
                        {uploading ? 'Đang tải...' : 'Tải lên'}
                    </button>

                    <button
                        onClick={fetchFiles}
                        disabled={loading}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#222',
                            color: '#fff',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                </div>

            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Đang tải...</div>
            ) : files.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #ccc', borderRadius: '8px' }}>
                    Không tìm thấy file media nào trong thư mục public.
                </div>
            ) : (
                <div className="media-grid">
                    {files.map((file) => (
                        <div key={file.name} className="media-card">
                            <div className="media-preview">
                                <img src={file.url} alt={file.name} />
                            </div>
                            <div className="media-info">
                                <div className="media-name" title={file.name}>{file.name}</div>
                                <div className="media-meta">
                                    {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                                </div>
                                <div className="media-actions">
                                    <button
                                        onClick={() => handleCopyUrl(file.url)}
                                        title="Copy URL"
                                    >
                                        <Copy size={16} /> {copying === file.url ? 'Copied!' : 'URL'}
                                    </button>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" title="View">
                                        <ExternalLink size={16} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        title="Delete"
                                        className="btn-delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .media-card {
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    flex-direction: column;
                }
                .media-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }
                .media-preview {
                    height: 150px;
                    background: #f8f8f8;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    overflow: hidden;
                    border-bottom: 1px solid #eee;
                    position: relative;
                }
                .media-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 0.5rem;
                }
                .media-info {
                    padding: 1rem;
                }
                .media-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 0.25rem;
                    color: #333;
                }
                .media-meta {
                    font-size: 0.75rem;
                    color: #888;
                    margin-bottom: 1rem;
                }
                .media-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .media-actions button, .media-actions a {
                    flex: 1;
                    padding: 0.4rem;
                    font-size: 0.75rem;
                    border: 1px solid #ddd;
                    background: #fff;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    gap: 0.4rem;
                    text-decoration: none;
                    color: #444;
                    transition: all 0.2s;
                }
                .media-actions button:hover, .media-actions a:hover {
                    background: #f5f5f5;
                    border-color: #bbb;
                }
                .btn-delete:hover {
                    background: #fff5f5 !important;
                    border-color: #feb2b2 !important;
                    color: #e53e3e !important;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
