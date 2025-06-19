import React, { useState, createContext, useContext } from 'react';
import IntroPage from './components/IntroPage';
import Dashboard from './components/Dashboard';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  udpId: string;
  setUdpId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [currentPage, setCurrentPage] = useState<'intro' | 'dashboard'>('intro');
  const [isDark, setIsDark] = useState(true);
  const [udpId, setUdpId] = useState('EV-001');

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, udpId, setUdpId }}>
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        {currentPage === 'intro' ? (
          <IntroPage onEnter={() => setCurrentPage('dashboard')} />
        ) : (
          <Dashboard onBack={() => setCurrentPage('intro')} />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;