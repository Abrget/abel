import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Case, STATIONS } from '../types';
import { formatDate } from '../utils/helpers';
import CaseDetailModal from '../components/CaseDetailModal';

const CasesPage: React.FC = () => {
    const { currentUser, cases } = useApp();
    const [filter, setFilter] = useState<string>('all');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    if (!currentUser) return null;

    const isPolice = currentUser.role === 'police';
    const userCases = isPolice
        ? cases.filter((c: Case) => c.station === currentUser.station)
        : currentUser.prosecutorId
            ? cases.filter((c: Case) => c.assignedProsecutorId === currentUser.prosecutorId)
            : cases;

    const filteredCases = filter === 'all'
        ? userCases
        : userCases.filter((c: Case) => c.status === filter);

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">📁 ጉዳዮች</h2>
                    <p className="text-gray-500">{filteredCases.length} ጉዳዮች ተገኝተዋል</p>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {[
                        { value: 'all', label: 'ሁሉም' },
                        { value: 'ዲዳ', label: 'ዲዳ' },
                        { value: 'ተጠናቀቀ', label: 'ተጠናቀቀ' },
                        { value: 'ወደ ዐቃቤ ህግ ተላከ', label: 'ወደ ዐቃቤ ህግ' },
                    ].map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${filter === opt.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filteredCases.map((c: Case) => (
                    <div
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    {c.caseNumber.split('-')[2]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{c.suspectName}</p>
                                    <p className="text-sm text-gray-500">{c.caseNumber} | {c.crimeType}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm ${c.status.includes('38') ? 'bg-purple-100 text-purple-700' :
                                        c.status.includes('42') ? 'bg-amber-100 text-amber-700' :
                                            c.status === 'ተጠናቀቀ' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                    }`}>
                                    {c.status}
                                </span>
                                {c.custodyType && (
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.custodyType === 'RTD' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {c.custodyType}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>📍 {STATIONS[c.station]}</span>
                            <span>📅 {formatDate(c.arrestDate)}</span>
                            {c.assignedProsecutorName && <span>⚖️ {c.assignedProsecutorName}</span>}
                            {c.article38Deadline && (
                                <span className="text-amber-600">⏰ አንቀጽ 38: {formatDate(c.article38Deadline)}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedCase && <CaseDetailModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />}
        </div>
    );
};

export default CasesPage;
