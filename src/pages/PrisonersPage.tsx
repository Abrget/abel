import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Case, STATIONS } from '../types';
import { formatDate, getDaysDiff } from '../utils/helpers';
import AddPrisonerModal from '../components/AddPrisonerModal';

const PrisonersPage: React.FC = () => {
    const { currentUser, prisoners, cases, addPrisoner } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'in_custody' | 'no_case'>('all');

    if (!currentUser) return null;

    const userPrisoners = currentUser.role === 'police'
        ? prisoners.filter(p => p.arrestingStation === currentUser.station)
        : prisoners;

    let filteredPrisoners = userPrisoners;
    if (filter === 'in_custody') {
        filteredPrisoners = filteredPrisoners.filter(p => p.status === 'IN_CUSTODY');
    } else if (filter === 'no_case') {
        filteredPrisoners = filteredPrisoners.filter(p => p.status === 'IN_CUSTODY' && !p.relatedCaseId);
    }

    if (searchTerm) {
        filteredPrisoners = filteredPrisoners.filter(p =>
            p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.prisonerId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const getStatusBadge = (status: string, hasCase: boolean) => {
        if (status === 'RELEASED') return <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">ተለቃል</span>;
        if (status === 'TRANSFERRED') return <span className="bg-purple-200 text-purple-700 px-2 py-1 rounded text-xs">ተሸጋገረ</span>;
        if (!hasCase) return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">⚠️ ጉዳይ የለም</span>;
        return <span className="bg-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs">በቁጥጥር ስር</span>;
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">👥 እስረኞች መዝገብ</h2>
                    <p className="text-gray-500">ሙሉ የእስረኛ ዝርዝር</p>
                </div>
                {currentUser.role === 'police' && (
                    <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                        <span>➕</span> አዲስ እስረኛ
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="ፈልግ... (ስም ወይም መለያ)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'in_custody' | 'no_case')}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">ሁሉም</option>
                        <option value="in_custody">በቁጥጥር ስር</option>
                        <option value="no_case">ጉዳይ የሌለው</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-2xl font-bold text-emerald-600">{filteredPrisoners.filter(p => p.status === 'IN_CUSTODY').length}</div>
                    <div className="text-gray-500 text-sm">በቁጥጥር ስር</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-2xl font-bold text-red-600">{filteredPrisoners.filter(p => p.status === 'IN_CUSTODY' && !p.relatedCaseId).length}</div>
                    <div className="text-gray-500 text-sm">ጉዳይ የሌለው</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-2xl font-bold text-gray-600">{filteredPrisoners.filter(p => p.status === 'RELEASED').length}</div>
                    <div className="text-gray-500 text-sm">ተለቃል</div>
                </div>
            </div>

            <div className="space-y-3">
                {filteredPrisoners.map(prisoner => {
                    const relatedCase = prisoner.relatedCaseId ? cases.find((c: Case) => c.id === prisoner.relatedCaseId) : null;
                    const daysInCustody = getDaysDiff(prisoner.arrestDate, new Date().toISOString());

                    return (
                        <div key={prisoner.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {prisoner.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{prisoner.fullName}</p>
                                        <p className="text-sm text-gray-500">{prisoner.prisonerId}</p>
                                        <p className="text-xs text-gray-400">
                                            {STATIONS[prisoner.arrestingStation]} | እድሜ: {prisoner.age} | {daysInCustody} ቀን በቁጥጥር ስር
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(prisoner.status, !!prisoner.relatedCaseId)}
                                    {relatedCase && (
                                        <span className="text-xs text-blue-600">📁 {relatedCase.caseNumber}</span>
                                    )}
                                    {!prisoner.relatedCaseId && prisoner.status === 'IN_CUSTODY' && (
                                        <span className="text-xs text-red-500 animate-pulse">⚠️ ጉዳይ ፍጠር ያስፈልጋል!</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div><span className="text-gray-500">📍</span> {prisoner.detentionFacility}</div>
                                <div><span className="text-gray-500">🚪</span> {prisoner.cellNumber || '—'}</div>
                                <div><span className="text-gray-500">📅</span> {formatDate(prisoner.arrestDate)}</div>
                                <div><span className="text-gray-500">🏥</span> {prisoner.healthNotes || 'ጤናማ'}</div>
                            </div>

                            {(prisoner.visitors?.length || 0) > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">👥 ጎብኚዎች ({prisoner.visitors?.length || 0})</p>
                                    <div className="flex gap-2 overflow-x-auto">
                                        {(prisoner.visitors || []).map((v, i) => (
                                            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs whitespace-nowrap">
                                                {v.visitorName} ({v.relation})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showAddModal && (
                <AddPrisonerModal onClose={() => setShowAddModal(false)} onAdd={addPrisoner} />
            )}
        </div>
    );
};

export default PrisonersPage;
