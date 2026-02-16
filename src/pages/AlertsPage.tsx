import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Alert, Case, Prisoner } from '../types';
import { formatDate } from '../utils/helpers';

const AlertsPage: React.FC = () => {
    const { alerts, markAlertRead, cases, prisoners } = useApp();
    const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'info'>('all');

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter((a: Alert) => a.type === filter);

    return (
        <div className="p-4 space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">🔔 ማስጠንቀቂያዎች</h2>
                <p className="text-gray-500">{filteredAlerts.length} ማስጠንቀቂያዎች</p>
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {(['all', 'urgent', 'warning', 'info'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${filter === f
                                ? f === 'urgent' ? 'bg-red-500 text-white'
                                    : f === 'warning' ? 'bg-amber-500 text-white'
                                        : f === 'info' ? 'bg-blue-500 text-white'
                                            : 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {f === 'all' ? 'ሁሉም' : f === 'urgent' ? 'አስቸኳይ' : f === 'warning' ? 'ማስጠንቀቂያ' : 'መረጃ'}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredAlerts.map((alert: Alert) => {
                    const relatedCase = alert.relatedCaseId ? cases.find((c: Case) => c.id === alert.relatedCaseId) : null;
                    const relatedPrisoner = alert.relatedPrisonerId ? prisoners.find((p: Prisoner) => p.prisonerId === alert.relatedPrisonerId) : null;

                    return (
                        <div
                            key={alert.id}
                            onClick={() => markAlertRead(alert.id)}
                            className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all border-r-4 ${alert.type === 'urgent' ? 'border-red-500' :
                                    alert.type === 'warning' ? 'border-amber-500' :
                                        'border-blue-500'
                                } ${alert.isRead ? 'opacity-60' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <span className={`text-2xl ${alert.type === 'urgent' ? '🔴' : alert.type === 'warning' ? '⚠️' : 'ℹ️'
                                        }`} />
                                    <div>
                                        <h3 className="font-bold text-gray-800">{alert.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                        {relatedCase && (
                                            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                📁 {relatedCase.caseNumber}
                                            </span>
                                        )}
                                        {relatedPrisoner && (
                                            <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                👤 {relatedPrisoner.prisonerId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{formatDate(alert.createdAt)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlertsPage;
