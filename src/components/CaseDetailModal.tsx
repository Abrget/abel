import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Case, Prisoner, STATIONS, PROSECUTION_STEPS } from '../types';
import { formatDate } from '../utils/helpers';

const CaseDetailModal: React.FC<{ caseData: Case; onClose: () => void }> = ({ caseData, onClose }) => {
    const { currentUser, prisoners, updateCase } = useApp();
    const [action, setAction] = useState<string>('');
    const [article38Reason, setArticle38Reason] = useState('');
    const [article42Reason, setArticle42Reason] = useState('');
    const [chargeType, setChargeType] = useState('');

    const prisoner = caseData.prisonerId ? prisoners.find((p: Prisoner) => p.prisonerId === caseData.prisonerId) : null;

    const handleAction = () => {
        if (!currentUser) return;

        const historyEntry = {
            date: new Date().toISOString().split('T')[0],
            action: action,
            user: currentUser.name,
            details: ''
        };

        switch (action) {
            case 'assign':
                updateCase(caseData.id, {
                    status: 'መስጠት',
                    currentStep: 2,
                    history: [...caseData.history, { ...historyEntry, details: 'ጉዳዩ ለዐቃቤ ህግ ተሰጥቷል' }]
                });
                break;
            case 'investigate':
                updateCase(caseData.id, {
                    status: 'መርማራ',
                    currentStep: 3,
                    history: [...caseData.history, { ...historyEntry, details: 'መርማራ ጀምሯል' }]
                });
                break;
            case 'article38':
                updateCase(caseData.id, {
                    status: 'አንቀጽ 38',
                    currentStep: 4,
                    article38Date: new Date().toISOString().split('T')[0],
                    article38Reason,
                    history: [...caseData.history, { ...historyEntry, details: `አንቀጽ 38: ${article38Reason}` }]
                });
                break;
            case 'article42':
                updateCase(caseData.id, {
                    status: 'አንቀጽ 42',
                    currentStep: 4,
                    article42Reason,
                    history: [...caseData.history, { ...historyEntry, details: `አንቀጽ 42: ${article42Reason}` }]
                });
                break;
            case 'charge':
                updateCase(caseData.id, {
                    status: 'ወንጀል ክስ',
                    currentStep: 4,
                    chargeType,
                    history: [...caseData.history, { ...historyEntry, details: `ወንጀል ክስ: ${chargeType}` }]
                });
                break;
            case 'court':
                updateCase(caseData.id, {
                    status: 'ወደ ፍርድ ቤት',
                    currentStep: 5,
                    courtDate: new Date().toISOString().split('T')[0],
                    history: [...caseData.history, { ...historyEntry, details: 'ወደ ፍርድ ቤት ተላከ' }]
                });
                break;
            case 'complete':
                updateCase(caseData.id, {
                    status: 'ተጠናቀቀ',
                    currentStep: 7,
                    history: [...caseData.history, { ...historyEntry, details: 'ጉዳዩ ተጠናቀቀ' }]
                });
                break;
        }
        onClose();
    };

    const isProsecutorUser = currentUser?.role === 'prosecutor' || currentUser?.role === 'teamleader' || currentUser?.role === 'admin';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{caseData.caseNumber}</h2>
                            <p className="text-gray-500">{caseData.status}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between overflow-x-auto pb-2">
                            {PROSECUTION_STEPS.map((step, i) => (
                                <div key={step.step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${caseData.currentStep >= step.step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {step.step}
                                    </div>
                                    {i < PROSECUTION_STEPS.length - 1 && (
                                        <div className={`w-8 h-0.5 ${caseData.currentStep > step.step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            {PROSECUTION_STEPS.map(s => <span key={s.step}>{s.name}</span>)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-700 mb-2">የወንጀለኛ መረጃ</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500">ስም:</span> {caseData.suspectName}</p>
                                <p><span className="text-gray-500">እድሜ:</span> {caseData.suspectAge}</p>
                                <p><span className="text-gray-500">ፆታ:</span> {caseData.suspectGender}</p>
                                <p><span className="text-gray-500">የወንጀል ዓይነት:</span> {caseData.crimeType}</p>
                                <p><span className="text-gray-500">የወንጀል ደረጃ:</span> {caseData.crimeLevel}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-700 mb-2">የፖሊስ መረጃ</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500">ጣቢያ:</span> {STATIONS[caseData.station]}</p>
                                <p><span className="text-gray-500">ባለሙያ:</span> {caseData.policeOfficer}</p>
                                <p><span className="text-gray-500">የታሰረበት ቀን:</span> {formatDate(caseData.arrestDate)}</p>
                                {caseData.custodyType && (
                                    <p><span className="text-gray-500">አይነት:</span>
                                        <span className={`ml-1 font-bold ${caseData.custodyType === 'RTD' ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {caseData.custodyType}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {prisoner && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-bold text-gray-700 mb-2">👤 የእስረኛ መረጃ</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p><span className="text-gray-500">ስም:</span> {prisoner.fullName}</p>
                                    <p><span className="text-gray-500">መለያ:</span> {prisoner.prisonerId}</p>
                                    <p><span className="text-gray-500">ክፍል:</span> {prisoner.cellNumber || '—'}</p>
                                </div>
                                <div>
                                    <p><span className="text-gray-500">ቦታ:</span> {prisoner.detentionFacility}</p>
                                    <p><span className="text-gray-500">ጤና:</span> {prisoner.healthNotes || 'ጤናማ'}</p>
                                    <p><span className="text-gray-500">ጎብኚዎች:</span> {prisoner.visitors.length}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isProsecutorUser && caseData.status !== 'ተጠናቀቀ' && (
                        <div className="border-t pt-4">
                            <h3 className="font-bold text-gray-700 mb-3">⚡ እርምጃ</h3>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                            >
                                <option value="">እርምጃ ይምረጡ</option>
                                <option value="assign">መስጠት</option>
                                <option value="investigate">መርማራ ጀምር</option>
                                <option value="article38">አንቀጽ 38</option>
                                <option value="article42">አንቀጽ 42</option>
                                <option value="charge">ወንጀል ክስ</option>
                                <option value="court">ወደ ፍርድ ቤት ላክ</option>
                                <option value="complete">ተጠናቀቀ</option>
                            </select>

                            {action === 'article38' && (
                                <textarea
                                    value={article38Reason}
                                    onChange={(e) => setArticle38Reason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                                    placeholder="ምክንያት ያስገቡ"
                                    rows={2}
                                />
                            )}
                            {action === 'article42' && (
                                <textarea
                                    value={article42Reason}
                                    onChange={(e) => setArticle42Reason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                                    placeholder="ምክንያት ያስገቡ"
                                    rows={2}
                                />
                            )}
                            {action === 'charge' && (
                                <input
                                    type="text"
                                    value={chargeType}
                                    onChange={(e) => setChargeType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                                    placeholder="የክስ ዓይነት ያስገቡ"
                                />
                            )}

                            {action && (
                                <button onClick={handleAction} className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                    አጽድቅ
                                </button>
                            )}
                        </div>
                    )}

                    {caseData.history.length > 0 && (
                        <div className="border-t mt-4 pt-4">
                            <h3 className="font-bold text-gray-700 mb-2">📜 ታሪክ</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {caseData.history.map((h, i) => (
                                    <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                                        <span className="text-gray-500">{formatDate(h.date)}</span>
                                        <span className="mx-2">-</span>
                                        <span className="font-medium">{h.action}</span>
                                        <span className="text-gray-500">by {h.user}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseDetailModal;
