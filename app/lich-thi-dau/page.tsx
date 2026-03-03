import Header from '../../components/Header';
import { scrapeSchedules, MatchInfo } from '../../lib/crawler/score-scraper';

export const metadata = {
    title: 'Lịch Thi Đấu & Kết Quả Bóng Đá Hôm Nay',
    description: 'Cập nhật lịch thi đấu và kết quả bóng đá trực tuyến nhanh nhất và chính xác nhất từ các giải đấu hàng đầu.',
};



export const revalidate = 60; // Revalidate every minute

export default async function LichThiDauPage() {
    // Tweak to support full schedule logic
    const matches = await scrapeSchedules();

    // Group matches by Date, then by League
    const groupedMatches: Record<string, Record<string, MatchInfo[]>> = {};

    matches.forEach(match => {
        if (!groupedMatches[match.date]) {
            groupedMatches[match.date] = {};
        }
        if (!groupedMatches[match.date][match.league]) {
            groupedMatches[match.date][match.league] = [];
        }
        groupedMatches[match.date][match.league].push(match);
    });

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <h1 style={{ marginBottom: '2rem', borderLeft: '5px solid #FFD700', paddingLeft: '1rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
                        Lịch thi đấu & Kết quả bóng đá trực tuyến
                    </h1>

                    {Object.keys(groupedMatches).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontStyle: 'italic' }}>
                            Hiện tại không có dữ liệu lịch thi đấu nào.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {Object.entries(groupedMatches).map(([date, leagues]) => (
                                <div key={date} className="schedule-date-group">
                                    <h2 style={{
                                        background: '#FFD700',
                                        padding: '12px 20px',
                                        color: '#000',
                                        borderRadius: '8px',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                        boxShadow: '0 2px 5px rgba(255,215,0,0.3)'
                                    }}>
                                        {date}
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {Object.entries(leagues).map(([league, leagueMatches]) => (
                                            <div key={league} className="league-group" style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                                                <h3 style={{
                                                    background: '#f8f9fa',
                                                    padding: '12px 20px',
                                                    margin: 0,
                                                    fontSize: '1.05rem',
                                                    borderBottom: '1px solid #eee',
                                                    color: '#333',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}>
                                                    <span style={{ width: '4px', height: '16px', background: '#FFD700', borderRadius: '2px', display: 'inline-block' }}></span>
                                                    {league}
                                                </h3>
                                                <div className="matches-list">
                                                    {leagueMatches.map((m, i) => (
                                                        <div key={i} style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'minmax(60px, auto) 1fr 70px 1fr',
                                                            alignItems: 'center',
                                                            padding: '16px 20px',
                                                            borderBottom: i < leagueMatches.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                            gap: '15px',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        >
                                                            <div style={{ color: '#666', fontSize: '0.95rem', fontWeight: '500' }}>{m.time}</div>

                                                            <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                                                {m.homeTeam}
                                                                {m.homeLogo && <img src={m.homeLogo} width={24} height={24} style={{ objectFit: 'contain' }} alt={m.homeTeam} />}
                                                            </div>

                                                            <div style={{
                                                                background: '#f5f5f5',
                                                                textAlign: 'center',
                                                                padding: '6px 8px',
                                                                borderRadius: '6px',
                                                                fontWeight: 'bold',
                                                                fontSize: '1rem',
                                                                border: '1px solid #e0e0e0',
                                                                color: '#111',
                                                                letterSpacing: '1px'
                                                            }}>
                                                                {m.score}
                                                            </div>

                                                            <div style={{ fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                {m.awayLogo && <img src={m.awayLogo} width={24} height={24} style={{ objectFit: 'contain' }} alt={m.awayTeam} />}
                                                                {m.awayTeam}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
