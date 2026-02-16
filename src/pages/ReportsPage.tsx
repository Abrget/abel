import React from 'react';
import { useApp } from '../context/AppContext';
import { Case, Prisoner, User, STATIONS } from '../types';

const ReportsPage: React.FC = () => {
    const { cases, prisoners, getProsecutorLoad, MOCK_USERS } = useApp();

    const totalCases = cases.length;
    const completedCases = cases.filter((c: Case) => c.status === 'ተጠናቀቀ').length;
    const rtdCases = cases.filter((c: Case) => c.custodyType === 'RTD').length;

    const inCustody = prisoners.filter((p: Prisoner) => p.status === 'IN_CUSTODY').length;
    const noCasePrisoners = prisoners.filter((p: Prisoner) => p.status === 'IN_CUSTODY' && !p.relatedCaseId).length;

    const prosecutors = MOCK_USERS.filter((u: User) => u.role === 'prosecutor');

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">📊 ሪፖርቶች</h2>
                <p className="text-gray-500">የስርዓቱ ሙሉ አጠቃላይ ሪፖርት</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-3xl font-bold text-blue-600">{totalCases}</div>
                    <div className="text-gray-500 text-sm">ጠቅላላ ጉዳዮች</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-3xl font-bold text-emerald-600">{completedCases}</div>
                    <div className="text-gray-500 text-sm">ተጠናቀዋል</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-3xl font-bold text-amber-600">{totalCases - completedCases}</div>
                    <div className="text-gray-500 text-sm">በመስማት ላይ</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <div className="text-3xl font-bold text-red-600">{rtdCases}</div>
                    <div className="text-gray-500 text-sm">RTD</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-4">👥 የእስረኞች ሪፖርት</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-emerald-600">{inCustody}</div>
                        <div className="text-sm text-gray-600">በቁጥጥር ስር</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">{noCasePrisoners}</div>
                        <div className="text-sm text-gray-600">ጉዳይ የሌለው</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-600">{prisoners.length - inCustody}</div>
                        <div className="text-sm text-gray-600">ተለቃል/ተሸጋገረ</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-4">⚖️ የዐቃቤ ህግ ጭንቅላት ሪፖርት</h3>
                <div className="space-y-3">
                    {prosecutors.map((p: User) => {
                        const load = getProsecutorLoad(p.prosecutorId || '');
                        const caseCount = cases.filter((c: Case) => c.assignedProsecutorId === p.prosecutorId).length;

                        return (
                            <div key={p.id} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{p.name}</p>
                                    <p className="text-sm text-gray-500">{p.specialization}</p>
                                </div>
                                <div className="w-32">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">{caseCount} ጉዳይ</span>
                                        <span className={`font-bold ${load >= 20 ? 'text-red-600' : load >= 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {load}/25
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all ${load >= 20 ? 'bg-red-500' : load >= 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${(load / 25) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-gray-800 mb-4">🏢 የፖሊስ ጣቢያ ሪፖርት</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(STATIONS).map(([id, name]) => {
                        const stationCases = cases.filter((c: Case) => c.station === id).length;
                        const stationPrisoners = prisoners.filter((p: Prisoner) => p.arrestingStation === id && p.status === 'IN_CUSTODY').length;
                        const noCaseStation = prisoners.filter((p: Prisoner) => p.arrestingStation === id && p.status === 'IN_CUSTODY' && !p.relatedCaseId).length;

                        return (
                            <div key={id} className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-bold text-gray-800">{name}</p>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                    <div className="text-center">
                                        <p className="font-bold text-blue-600">{stationCases}</p>
                                        <p className="text-gray-500">ጉዳዮች</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-emerald-600">{stationPrisoners}</p>
                                        <p className="text-gray-500">እስረኞች</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-red-600">{noCaseStation}</p>
                                        <p className="text-gray-500">ጉዳይ የሌለው</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
