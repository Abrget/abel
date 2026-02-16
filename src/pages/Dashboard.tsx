import React from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS } from '../types';
import { getDaysDiff } from '../utils/helpers';

const Dashboard: React.FC = () => {
    const { currentUser, cases, prisoners, alerts, getProsecutorLoad } = useApp();

    if (!currentUser) return null;

    const isPolice = currentUser.role === 'police';
    const isTeamLeader = currentUser.role === 'teamleader' || currentUser.role === 'admin';
    const isProsecution = currentUser.role === 'prosecutor' || isTeamLeader;

    const policeCases = isPolice ? cases.filter(c => c.station === currentUser.station) : cases;
    const myCases = currentUser.prosecutorId
        ? cases.filter(c => c.assignedProsecutorId === currentUser.prosecutorId)
        : policeCases;

    const pendingCases = myCases.filter(c =>
        c.status.includes('ወደ') || c.status.includes('መር') || c.status.includes('ተቀባይ') || c.status.includes('መስጠት')
    );
    const completedCases = myCases.filter(c => c.status === 'ተጠናቀቀ');
    const rtdCases = myCases.filter(c => c.custodyType === 'RTD');
    const urgentCases = rtdCases.filter(c => {
        if (c.article38Deadline) {
            const daysLeft = getDaysDiff(new Date().toISOString(), c.article38Deadline);
            return daysLeft <= 7;
        }
        return false;
    });

    const noCasePrisoners = prisoners.filter(p => p.status === 'IN_CUSTODY' && !p.relatedCaseId);
    const noCaseDays = noCasePrisoners.map(p => ({
        ...p,
        daysInCustody: getDaysDiff(p.arrestDate, new Date().toISOString())
    }));

    const prosecutorLoad = currentUser.prosecutorId ? getProsecutorLoad(currentUser.prosecutorId) : 0;

    return (
        <div className="space-y-6 p-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">እንኳን ደህና መጡ {currentUser.name}!</h2>
                <p className="opacity-90">
                    {isPolice && `እርስዎ በ${STATIONS[currentUser.station || 'station-1']} ፖሊስ ጣቢያ ነው`}
                    {isProsecution && !currentUser.prosecutorId && 'እርስዎ በዐቃቤ ህግ ክፍል ነው'}
                    {currentUser.prosecutorId && `እርስዎ ዐቃቤ ህግ ${currentUser.prosecutorId} (${currentUser.specialization}) ነው`}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="text-3xl font-bold text-emerald-600">{myCases.length}</div>
                    <div className="text-gray-500 text-sm">ጠቅላላ ጉዳዮች</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="text-3xl font-bold text-amber-600">{pendingCases.length}</div>
                    <div className="text-gray-500 text-sm">በመስማት ላይ</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="text-3xl font-bold text-blue-600">{completedCases.length}</div>
                    <div className="text-gray-500 text-sm">ተጠናቀዋል</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="text-3xl font-bold text-red-600">{urgentCases.length}</div>
                    <div className="text-gray-500 text-sm">አስቸኳይ</div>
                </div>
            </div>

            {currentUser.prosecutorId && (
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3">📊 የእኔ ጭንቅላት ማስኬጃ</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${prosecutorLoad >= 20 ? 'bg-red-500' : prosecutorLoad >= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${(prosecutorLoad / 25) * 100}%` }}
                            />
                        </div>
                        <span className="font-bold text-gray-700">{prosecutorLoad}/25</span>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🔔</span> ማስጠንቀቂያዎች
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {alerts.filter(a => !a.isRead).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">ማስጠንቀቂያ የለም</p>
                        ) : (
                            alerts.filter(a => !a.isRead).map(alert => (
                                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.type === 'urgent' ? 'bg-red-50 border-red-500' :
                                        alert.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                                            'bg-blue-50 border-blue-500'
                                    }`}>
                                    <p className="font-semibold text-sm text-gray-800">{alert.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>⚠️</span> ጉዳይ የሌለው እስረኞች
                    </h3>
                    {noCaseDays.length === 0 ? (
                        <p className="text-emerald-600 text-center py-4">✓ ሁሉም እስረኞች ጉዳይ አላቸው</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {noCaseDays.map(prisoner => (
                                <div key={prisoner.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{prisoner.fullName}</p>
                                            <p className="text-xs text-gray-600">{prisoner.prisonerId}</p>
                                        </div>
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {prisoner.daysInCustody} ቀን
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isPolice && (
                <div className="grid md:grid-cols-2 gap-4">
                    <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
                        <span className="text-2xl">➕</span>
                        <div className="text-right">
                            <p className="font-bold">አዲስ ጉዳይ ፍጠር</p>
                            <p className="text-xs opacity-90">አዲስ ወንጀል ጉዳይ ይመዝገብ</p>
                        </div>
                    </button>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
                        <span className="text-2xl">👤</span>
                        <div className="text-right">
                            <p className="font-bold">እስረኛ መዝግያ</p>
                            <p className="text-xs opacity-90">አዲስ እስረኛ ይመዝገብ</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
