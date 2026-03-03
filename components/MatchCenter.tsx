"use client";

import { useState, useEffect } from 'react';
import { MatchInfo } from '../lib/crawler/score-scraper';

export default function MatchCenter({ initialMatches }: { initialMatches: MatchInfo[] }) {
    const [matches, setMatches] = useState<MatchInfo[]>(initialMatches);
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        const pollMatches = async () => {
            setIsPolling(true);
            try {
                const res = await fetch('/api/matches');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMatches(data);
                }
            } catch (error) {
                console.error('Polling error:', error);
            } finally {
                setIsPolling(false);
            }
        };

        const interval = setInterval(pollMatches, 60000); // Poll every 60 seconds
        return () => clearInterval(interval);
    }, []);

    // Helper to detect if a match is "live" based on score or time info
    // (Note: In a real app, the scraper would provide a 'status' field)
    const isLive = (match: MatchInfo) => {
        const score = match.score.trim();
        const scorePattern = /^\d+-\d+$/;
        return scorePattern.test(score) && !match.time.includes(':'); // Heuristic implementation
    };

    return (
        <div className="match-center-widget" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'var(--primary-color)', padding: '1rem', fontWeight: '900', fontSize: '0.9rem', color: '#000', textAlign: 'center', letterSpacing: '1px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                LỊCH THI ĐẤU & KẾT QUẢ
                {isPolling && <span className="animate-spin" style={{ fontSize: '0.6rem' }}>⏳</span>}
            </div>

            <div className="matches-list" style={{ maxHeight: '450px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                {matches.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-color)', opacity: 0.6 }}>
                        Đang tải dữ liệu trận đấu...
                    </div>
                ) : (
                    matches.map((match, i) => {
                        const live = isLive(match);
                        return (
                            <div key={i} className="match-row" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'background 0.2s', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.7, fontWeight: 'bold' }}>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: '800' }}>{match.league.toUpperCase()}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {live && <div className="pulsing-dot"></div>}
                                        <span style={{ color: live ? '#ff4d4d' : 'inherit' }}>{match.date} • {match.time}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flex: 1, textAlign: 'right', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-color)' }}>
                                        {match.homeTeam}
                                    </div>
                                    <div style={{ padding: '4px 12px', background: live ? 'rgba(255, 77, 77, 0.1)' : 'var(--bg-color)', borderRadius: '6px', fontSize: '1rem', fontWeight: '900', color: live ? '#ff4d4d' : 'var(--text-color)', border: live ? '1px solid #ff4d4d' : '1px solid var(--border-color)', minWidth: '60px', textAlign: 'center' }}>
                                        {match.score}
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-color)' }}>
                                        {match.awayTeam}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                <a href="/lich-thi-dau" style={{ fontSize: '0.8rem', color: 'var(--text-color)', fontWeight: '800', textDecoration: 'none', transition: 'all 0.2s' }} className="view-all-link">
                    XEM TOÀN BỘ LỊCH THI ĐẤU &raquo;
                </a>
            </div>

            <style jsx>{`
                .match-row:hover {
                    background: rgba(255, 215, 0, 0.05);
                }
                .view-all-link:hover {
                    color: var(--primary-color) !important;
                    letter-spacing: 0.5px;
                }
            `}</style>
        </div>
    );
}

