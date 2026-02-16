import React from 'react';
import { useApp } from '../context/AppContext';
import AddressBanner from './AddressBanner';

const Header: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; onLogout: () => void }> = ({ activeTab, setActiveTab, onLogout }) => {
    const { currentUser, alerts } = useApp();
    const unreadAlerts = alerts.filter(a => !a.isRead).length;

    const tabs = [
        { id: 'dashboard', label: 'ቤት', icon: '🏠', roles: ['police', 'prosecutor', 'teamleader', 'admin'] },
        { id: 'prisoners', label: 'እስረኞች', icon: '👥', roles: ['police', 'prosecutor', 'teamleader', 'admin'] },
        { id: 'cases', label: 'ጉዳዮች', icon: '📁', roles: ['police', 'prosecutor', 'teamleader', 'admin'] },
        { id: 'assign', label: 'መስጠት', icon: '📋', roles: ['teamleader', 'admin'] },
        { id: 'alerts', label: 'ማስጠንቀቂያ', icon: '🔔', roles: ['prosecutor', 'teamleader', 'admin'], badge: unreadAlerts },
        { id: 'reports', label: 'ሪፖርቶች', icon: '📊', roles: ['teamleader', 'admin'] },
    ];

    const filteredTabs = tabs.filter(t => currentUser && t.roles.includes(currentUser.role));

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <AddressBanner />
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-xl">⚖️</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-lg">የፍትህ ሚኒስተር አራዳ ቅ/ጽ ቤት</h1>
                            <p className="text-xs text-gray-500">የጉዳይ አስተዳደር ስርዓት</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentUser && (
                            <div className="text-right hidden md:block">
                                <p className="font-semibold text-sm">{currentUser.name}</p>
                                <p className="text-xs text-gray-500">{currentUser.role === 'police' ? 'ፖሊስ' : currentUser.role === 'prosecutor' ? 'ዐቃቤ ህግ' : currentUser.role === 'teamleader' ? 'የቡድን መሪ' : 'አስተዳዳሪ'}</p>
                            </div>
                        )}
                        <button onClick={onLogout} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="ውጣ">
                            <span>🚪</span>
                        </button>
                    </div>
                </div>
                <nav className="mt-3 flex gap-1 overflow-x-auto pb-2">
                    {filteredTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.badge && tab.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
