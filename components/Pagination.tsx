import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageUrl = (page: number) => {
        const url = new URL(baseUrl, 'http://localhost:3000'); // Base URL doesn't matter much here as we use path
        return `${baseUrl}?page=${page}`;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '2rem 0', alignItems: 'center' }}>
            {currentPage > 1 && (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: '#000',
                        background: '#fff'
                    }}
                >
                    &laquo; Trang trước
                </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={getPageUrl(page)}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: currentPage === page ? '#fff' : '#000',
                        background: currentPage === page ? '#1d2327' : '#fff',
                        fontWeight: currentPage === page ? 'bold' : 'normal'
                    }}
                >
                    {page}
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: '#000',
                        background: '#fff'
                    }}
                >
                    Trang sau &raquo;
                </Link>
            )}
        </div>
    );
}
