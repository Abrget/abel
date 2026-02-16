import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Case, User, CrimeType } from '../types';

const AssignPage: React.FC = () => {
    const { cases, updateCase, getProsecutorLoad, MOCK_USERS } = useApp();
    const [selectedCaseId, setSelectedCaseId] = useState<string>('');
    const [selectedProsecutor, setSelectedProsecutor] = useState<string>('');

    const unassignedCases = cases.filter((c: Case) =>
        c.status.includes('ወደ ዐቃቤ') || c.status.includes('ተቀባይ')
    );

    const prosecutors = MOCK_USERS.filter((u: User) => u.role === 'prosecutor');

    const handleAssign = () => {
        if (!selectedCaseId || !selectedProsecutor) return;

        const prosecutor = prosecutors.find((p: User) => p.prosecutorId === selectedProsecutor);
        if (!prosecutor) return;

        updateCase(selectedCaseId, {
            status: 'መስጠት',
            currentStep: 2,
            assignedProsecutorId: selectedProsecutor,
            assignedProsecutorName: prosecutor.name,
        });

        setSelectedCaseId('');
        setSelectedProsecutor('');
    };

    const getSpecializationForCrime = (crimeType: CrimeType): string => {
        const map: Record<string, string[]> = {
            'ግድያ': ['PROS-01'],
            'ሞገስ': ['PROS-01'],
            'ስርቆት': ['PROS-02'],
            'ስንቅ': ['PROS-02', 'PROS-01'],
            'ቅማሸት': ['PROS-03'],
            'አደንዛዥ': ['PROS-04'],
        };
        return map[crimeType]?.[0] || 'PROS-07';
    };

    const selectedCase = unassignedCases.find((c: Case) => c.id === selectedCaseId);

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">📋 ዐቃቤ ህግ መስጠት</h2>
                <p className="text-gray-500">ጉዳዮችን ለዐቃቤ ህግ መስጠት</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-3">📥 ጉዳዮች ገንዳ (የሌለው {unassignedCases.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {unassignedCases.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">የሌለው ጉዳይ የለም</p>
                    ) : (
                        unassignedCases.map((c: Case) => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedCaseId(c.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedCaseId === c.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{c.suspectName}</p>
                                        <p className="text-sm text-gray-500">{c.caseNumber} | {c.crimeType}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs ${c.custodyType === 'RTD' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {c.custodyType}
                                        </span>
                                        {c.custodyType === 'RTD' && (
                                            <p className="text-xs text-red-500 mt-1">⚠️ አስቸኳይ</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-3">👥 ዐቃቤ ህግ ዝርዝር</h3>
                <div className="space-y-2">
                    {prosecutors.map((p: User) => {
                        const load = getProsecutorLoad(p.prosecutorId || '');
                        const isAvailable = load < 25;
                        const isRecommended = selectedCase && isAvailable &&
                            getSpecializationForCrime(selectedCase.crimeType) === p.prosecutorId;

                        return (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProsecutor(p.prosecutorId || '')}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedProsecutor === p.prosecutorId ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                                    } ${!isAvailable ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{p.name}</p>
                                        <p className="text-sm text-gray-500">{p.specialization}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{load}/25</p>
                                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className={`h-2 rounded-full ${load >= 20 ? 'bg-red-500' : load >= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${(load / 25) * 100}%` }}
                                            />
                                        </div>
                                        {isRecommended && <span className="text-xs text-emerald-600">★ የሚመከር</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedCaseId && selectedProsecutor && (
                <button
                    onClick={handleAssign}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    ✓ መስጠት
                </button>
            )}
        </div>
    );
};

export default AssignPage;
