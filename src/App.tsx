import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PrisonersPage from './pages/PrisonersPage';
import CasesPage from './pages/CasesPage';
import AssignPage from './pages/AssignPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      if (currentUser.role === 'teamleader' || currentUser.role === 'admin') {
        setActiveTab('assign');
      } else if (currentUser.role === 'prosecutor') {
        setActiveTab('cases');
      } else {
        setActiveTab('dashboard');
      }
    } else {
      setIsLoggedIn(false);
      setActiveTab('dashboard');
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
          <main className="container mx-auto max-w-6xl py-6">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'prisoners' && <PrisonersPage />}
            {activeTab === 'cases' && <CasesPage />}
            {activeTab === 'assign' && <AssignPage />}
            {activeTab === 'alerts' && <AlertsPage />}
            {activeTab === 'reports' && <ReportsPage />}
          </main>
          <footer className="bg-gray-800 text-white py-6 px-4 mt-8">
            <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2">🏛️ አራዳ ም/ጽ/ቤት</h4>
                <p className="text-gray-400 text-sm">የፍትህ ሚኒስተር አራዳ ቅ/ጽ ቤት የጉዳይ አስተዳደር ስርዓት</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">📍 አድራሻ</h4>
                <p className="text-gray-400 text-sm">ከጊዮርጊስ ቤ/ክርስቲያን ከፍ ብሎ አዲስ አበባ ፖሊስ ኮሚሽን ፊት ለፊት</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">📞 ስልክ</h4>
                <p className="text-gray-400 text-sm">0111-56-23-25</p>
                <p className="text-gray-500 text-xs mt-2">© 2024 ሁሉም መብቶች የተጠበቁ ናቸው</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
