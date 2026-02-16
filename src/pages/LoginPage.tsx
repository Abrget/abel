import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isSeeding, setIsSeeding] = useState(false);
    const { login, seedData } = useApp();

    const handleSeed = async () => {
        setIsSeeding(true);
        await seedData();
        setIsSeeding(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(email, password)) {
            onLogin();
        } else {
            setError('የተሳሳተ ኢሜይል ወይም ሚስትሌንት');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4 text-center text-sm">
                <span className="font-bold">🏛️ አራዳ ም/ጽ/ቤት</span>
                <span className="mx-4">|</span>
                <span>📞 0111-56-23-25</span>
                <span className="mx-4">|</span>
                <span className="hidden md:inline">📍 ከጊዮርጊስ ቤ/ክርስቲያን ከፍ ብሎ አዲስ አበባ ፖሊስ ኮሚሽን ፊት ለፊት</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 mt-12">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">⚖️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">የፍትህ ሚኒስተር አራዳ ቅ/ጽ ቤት</h1>
                    <p className="text-blue-200">የጉዳይ አስተዳደር ስርዓት</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white mb-2 font-medium">ኢሜይል</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="ኢሜይል ያስገቡ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-2 font-medium">ሚስትሌንት</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="ሚስትሌንት ያስገቡ"
                            required
                        />
                    </div>
                    {error && <p className="text-red-300 text-sm">{error}</p>}
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg">
                        ግባእ
                    </button>
                </form>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-2 text-sm">📋 ሙከራ ተጠቃሚዎች</h3>
                    <div className="text-xs text-blue-200 space-y-1">
                        <p><span className="text-emerald-400">ፖሊስ:</span> officer.jalmeda@example.com / password123</p>
                        <p><span className="text-blue-400">ዐቃቤ ህግ 1:</span> fikadu@example.com / password123</p>
                        <p><span className="text-blue-400">ዐቃቤ ህግ 2:</span> minista@example.com / password123</p>
                        <p><span className="text-amber-400">ቡድን መሪ:</span> teamleader@example.com / password123</p>
                    </div>
                    <button
                        type="button"
                        disabled={isSeeding}
                        onClick={handleSeed}
                        className={`mt-4 w-full py-2 text-white text-xs rounded transition-colors flex items-center justify-center gap-2 ${isSeeding ? 'bg-amber-800 cursor-not-allowed' : 'bg-amber-600/50 hover:bg-amber-600'
                            }`}
                    >
                        {isSeeding ? (
                            <>
                                <span className="animate-spin text-lg">⏳</span>
                                በመጫን ላይ...
                            </>
                        ) : (
                            'መረጃዎችን አዘጋጅ (Seed Database)'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
