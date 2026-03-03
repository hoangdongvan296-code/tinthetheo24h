"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Home, Zap, Trophy, Video, Calendar, Newspaper, Star } from 'lucide-react';

export default function Nav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const mainItems = [
        { name: 'TRANG CHỦ', path: '/', icon: <Home size={18} /> },
        { name: 'CHUYỂN NHƯỢNG', path: '/chuyen-nhuong', icon: <Zap size={18} /> },
        { name: 'NGOẠI HẠNG ANH', path: '/ngoai-hang-anh', icon: <Trophy size={18} /> },
        { name: 'LA LIGA', path: '/la-liga', icon: <Trophy size={18} /> },
        { name: 'BUNDESLIGA', path: '/bundesliga', icon: <Trophy size={18} /> },
    ];

    const dropdownItems = [
        { name: 'SERIE A', path: '/serie-a', icon: <Trophy size={18} /> },
        { name: 'LIGUE 1', path: '/ligue-1', icon: <Trophy size={18} /> },
        { name: 'CÚP C1', path: '/champions-league', icon: <Star size={18} /> },
        { name: 'CÚP C2', path: '/europa-league', icon: <Star size={18} /> },
    ];

    const footerItems = [
        { name: 'VIDEO', path: '/video', icon: <Video size={18} /> },
        { name: 'LỊCH THI ĐẤU', path: '/lich-thi-dau', icon: <Calendar size={18} /> },
    ];

    // Mobile uses all items
    const mobileMenuItems = [...mainItems, ...dropdownItems, ...footerItems];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav style={{ marginLeft: 'auto' }}>
            {/* Desktop Navigation */}
            <ul
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    listStyle: 'none',
                    gap: '0.4rem',
                    margin: 0,
                    padding: 0,
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'

                }}
                className="desktop-menu-flex"
            >
                {mainItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className="nav-link-pc"
                                style={{
                                    color: isActive ? '#000' : '#fff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    padding: '8px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: isActive ? '#FFD700' : 'transparent',
                                    display: 'block'
                                }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}

                {/* Dropdown Menu for PC */}
                <li className="dropdown-parent" style={{ position: 'relative' }}>
                    <div
                        className="nav-link-pc"
                        style={{
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'

                        }}
                    >
                        GIẢI ĐẤU KHÁC <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
                    </div>

                    <ul className="dropdown-menu">
                        {dropdownItems.map((subItem) => (
                            <li key={subItem.path}>
                                <Link
                                    href={subItem.path}
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        fontSize: '0.8rem',
                                        transition: 'background 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                    className="dropdown-item"
                                >
                                    {subItem.name}

                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>

                {footerItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className="nav-link-pc"
                                style={{
                                    color: isActive ? '#000' : '#fff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    padding: '8px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: isActive ? '#FFD700' : 'transparent',
                                    display: 'block'
                                }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <style jsx>{`
                .nav-link-pc:hover {
                    color: #FFD700 !important;
                    background-color: rgba(255, 215, 0, 0.1) !important;
                }
                
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 215, 0, 0.2);
                    border-radius: 12px;
                    padding: 8px 0;
                    list-style: none;
                    min-width: 160px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    z-index: 100;
                }
                
                .dropdown-parent:hover .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .dropdown-item:hover {
                    background: rgba(255, 215, 0, 0.1);
                    color: #FFD700 !important;
                }
            `}</style>

            {/* Premium Hamburger Button - Mobile Only */}
            <button
                onClick={toggleMenu}
                className="desktop-hide"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#222',
                    border: '1px solid #444',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    color: '#FFD700',
                    cursor: 'pointer',
                    zIndex: 2001,
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
                <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>
                    {isOpen ? 'ĐÓNG' : 'MENU'}
                </span>
            </button>

            {/* Side-sliding Drawer Backdrop */}
            {isOpen && (
                <div
                    onClick={toggleMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 1999,
                        animation: 'fadeIn 0.3s ease'
                    }}
                />
            )}

            {/* Premium Drawer Context */}
            <div
                className={`desktop-hide ${isOpen ? 'drawer-active' : 'drawer-hidden'}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    height: '100%',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow: isOpen ? '-10px 0 30px rgba(0,0,0,0.5)' : 'none'
                }}
            >
                <div className="glass-effect" style={{ flex: 1, padding: '80px 0 2rem 0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid rgba(255,215,0,0.1)', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px', fontWeight: 'bold' }}>DANH MỤC</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1 }}>
                        {mobileMenuItems.map((item, idx) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={item.path} className="menu-item-animate">
                                    <Link
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '16px 24px',
                                            color: isActive ? '#FFD700' : '#eee',
                                            textDecoration: 'none',
                                            borderLeft: isActive ? '3px solid #FFD700' : '3px solid transparent',
                                            background: isActive ? 'rgba(255, 215, 0, 0.05)' : 'transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ color: isActive ? '#FFD700' : '#666' }}>{item.icon}</span>
                                            <span style={{ fontSize: '0.95rem', fontWeight: isActive ? '800' : '600' }}>{item.name}</span>
                                        </div>
                                        <ChevronRight size={16} style={{ opacity: 0.5 }} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Drawer Footer */}
                    <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,215,0,0.1)', marginTop: 'auto' }}>
                        <p style={{ color: '#444', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1rem' }}>KẾT NỐI VỚI CHÚNG TÔI</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>f</div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>t</div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>y</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
