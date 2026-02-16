import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Prisoner } from '../types';
import { generatePrisonerId } from '../utils/helpers';

const AddPrisonerModal: React.FC<{
    onClose: () => void;
    onAdd: (prisoner: Omit<Prisoner, 'id' | 'createdAt' | 'visitors'>) => void;
}> = ({ onClose, onAdd }) => {
    const { currentUser } = useApp();
    const [formData, setFormData] = useState({
        fullName: '',
        alias: '',
        gender: 'ወንጀለኛ' as 'ወንጀለኛ' | 'ወንጀለኛምላክ',
        age: '',
        arrestDate: new Date().toISOString().split('T')[0],
        healthNotes: '',
        cellNumber: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        onAdd({
            prisonerId: generatePrisonerId(currentUser.station || 'station-1'),
            fullName: formData.fullName,
            alias: formData.alias || undefined,
            gender: formData.gender,
            age: parseInt(formData.age),
            arrestDate: formData.arrestDate,
            arrestingStation: currentUser.station || 'station-1',
            detentionFacility: 'አዲስ አበባ የቁጥጥር ቤት',
            cellNumber: formData.cellNumber || undefined,
            healthNotes: formData.healthNotes || undefined,
            status: 'IN_CUSTODY',
            relatedCaseId: undefined,
            createdBy: currentUser.id,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">➕ አዲስ እስረኛ መዝግያ</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ሙሉ ስም *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="ሙሉ ስም ያስገቡ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ስም</label>
                                <input
                                    type="text"
                                    value={formData.alias}
                                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="የሚታወቅበት ስም"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ፆታ *</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'ወንጀለኛ' | 'ወንጀለኛምላክ' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="ወንጀለኛ">ወንድ</option>
                                    <option value="ወንጀለኛምላክ">ሴት</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">እድሜ *</label>
                                <input
                                    type="number"
                                    required
                                    min="15"
                                    max="100"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="እድሜ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">የተያያዘበት ቀን *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.arrestDate}
                                    onChange={(e) => setFormData({ ...formData, arrestDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">የቁጥጥር ቤት</label>
                                <input
                                    type="text"
                                    value="አዲስ አበባ የቁጥጥር ቤት"
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ክፍል ቁጥር</label>
                                <input
                                    type="text"
                                    value={formData.cellNumber}
                                    onChange={(e) => setFormData({ ...formData, cellNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="ለምሳሌ B3-12"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">የጤና ማስታወሻ</label>
                            <textarea
                                value={formData.healthNotes}
                                onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="ለምሳሌ የስኳር በሽታ ተጋለጠዋል"
                                rows={2}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                ይቁም
                            </button>
                            <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                መዝግያ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPrisonerModal;
