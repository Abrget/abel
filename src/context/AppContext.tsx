import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, Case, Prisoner, Alert } from '../types';
import { MOCK_CASES, MOCK_PRISONERS, MOCK_ALERTS, MOCK_USERS as INITIAL_MOCK_USERS } from '../data';
import { generateId, generateCaseNumber } from '../utils/helpers';
import { db } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';

interface AppContextType {
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    cases: Case[];
    addCase: (newCase: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'history'>) => void;
    updateCase: (id: string, updates: Partial<Case>) => void;
    prisoners: Prisoner[];
    addPrisoner: (newPrisoner: Omit<Prisoner, 'id' | 'createdAt' | 'visitors'>) => void;
    updatePrisoner: (id: string, updates: Partial<Prisoner>) => void;
    alerts: Alert[];
    markAlertRead: (id: string) => void;
    getProsecutorLoad: (prosecutorId: string) => number;
    getProsecutorCases: (prosecutorId: string) => Case[];
    MOCK_USERS: User[];
    seedData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [cases, setCases] = useState<Case[]>([]);
    const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const casesRef = ref(db, 'cases');
        const prisonersRef = ref(db, 'prisoners');
        const alertsRef = ref(db, 'alerts');

        const unsubscribeCases = onValue(casesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCases(Object.values(data));
            } else {
                setCases([]);
            }
        });

        const unsubscribePrisoners = onValue(prisonersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPrisoners(Object.values(data));
            } else {
                setPrisoners([]);
            }
        });

        const unsubscribeAlerts = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Sort alerts by date descending
                const alertsList = Object.values(data) as Alert[];
                setAlerts(alertsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setAlerts([]);
            }
        });

        return () => {
            unsubscribeCases();
            unsubscribePrisoners();
            unsubscribeAlerts();
        };
    }, []);

    const login = (email: string, password: string): boolean => {
        const user = INITIAL_MOCK_USERS.find((u: User) => u.email === email);
        if (user && password === 'password123') {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const clean = (obj: any) => JSON.parse(JSON.stringify(obj));

    const seedData = async () => {
        try {
            console.log('Seeding database...');
            // Seed MOCK_USERS is handled locally for now as it doesn't change

            const seedPromises = [
                ...INITIAL_MOCK_USERS.map(u => set(ref(db, `users/${u.id}`), clean(u))),
                ...MOCK_CASES.map(c => set(ref(db, `cases/${c.id}`), clean(c))),
                ...MOCK_PRISONERS.map(p => set(ref(db, `prisoners/${p.id}`), clean(p))),
                ...MOCK_ALERTS.map(a => set(ref(db, `alerts/${a.id}`), clean(a)))
            ];
            await Promise.all(seedPromises);
            console.log('Database seeded successfully!');
            alert('መረጃዎች በተሳካ ሁኔታ ተዘጋጅተዋል! (Database Seeded Successfully)');
        } catch (error) {
            console.error('Error seeding database:', error);
            alert('መረጃዎችን ማዘጋጀት አልተቻለም። እባክዎ Firebase configuration ያረጋግጡ።');
        }
    };

    const addCase = (newCase: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'history'>) => {
        const id = generateId();
        const caseObj: Case = {
            ...newCase,
            id,
            caseNumber: generateCaseNumber(newCase.station),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [{
                date: new Date().toISOString().split('T')[0],
                action: 'ጉዳይ ተፈጥሮዋል',
                user: currentUser?.name || 'Unknown',
                details: 'ጉዳይ ተፈጥሮዋል'
            }]
        };
        set(ref(db, `cases/${id}`), clean(caseObj));
    };

    const updateCase = (id: string, updates: Partial<Case>) => {
        update(ref(db, `cases/${id}`), clean({
            ...updates,
            updatedAt: new Date().toISOString()
        }));
    };

    const addPrisoner = (newPrisoner: Omit<Prisoner, 'id' | 'createdAt' | 'visitors'>) => {
        const id = generateId();
        const prisonerObj: Prisoner = {
            ...newPrisoner,
            id,
            createdAt: new Date().toISOString(),
            visitors: []
        };
        set(ref(db, `prisoners/${id}`), clean(prisonerObj));

        const alertId = generateId();
        const alertObj: Alert = {
            id: alertId,
            type: 'info',
            title: 'አዲስ እስረኛ',
            message: `${newPrisoner.fullName} ተመዝግዧል ነገር ግን ጉዳይ አልተፈጠረም`,
            relatedPrisonerId: newPrisoner.prisonerId,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        set(ref(db, `alerts/${alertId}`), clean(alertObj));
    };

    const updatePrisoner = (id: string, updates: Partial<Prisoner>) => {
        update(ref(db, `prisoners/${id}`), clean(updates));
    };

    const markAlertRead = (id: string) => {
        update(ref(db, `alerts/${id}`), clean({ isRead: true }));
    };

    const getProsecutorLoad = (prosecutorId: string): number => {
        return cases.filter((c: Case) =>
            c.assignedProsecutorId === prosecutorId &&
            c.status !== 'ተጠናቀቀ'
        ).length;
    };

    const getProsecutorCases = (prosecutorId: string): Case[] => {
        return cases.filter((c: Case) => c.assignedProsecutorId === prosecutorId);
    };

    const contextValue: AppContextType = {
        currentUser,
        login,
        logout,
        cases,
        addCase,
        updateCase,
        prisoners,
        addPrisoner,
        updatePrisoner,
        alerts,
        markAlertRead,
        getProsecutorLoad,
        getProsecutorCases,
        MOCK_USERS: INITIAL_MOCK_USERS,
        seedData
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
