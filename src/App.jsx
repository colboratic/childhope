import React, { useState, useEffect } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import CycleCalendar from './components/CycleCalendar';
import CycleInfo from './components/CycleInfo';
import OvulationInfo from './components/OvulationInfo';
import CycleTips from './components/CycleTips';

function App() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [showCalendar, setShowCalendar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // โหลดข้อมูลจาก localStorage เมื่อ mount
  useEffect(() => {
    const saved = localStorage.getItem('ovulationData');
    if (saved) {
      const { lastPeriod: lp, cycleLength: cl } = JSON.parse(saved);
      setLastPeriod(lp);
      setCycleLength(cl);
    }
    // โหลด dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // บันทึกข้อมูลลง localStorage
  useEffect(() => {
    if (lastPeriod && cycleLength) {
      localStorage.setItem(
        'ovulationData',
        JSON.stringify({ lastPeriod, cycleLength })
      );
    }
  }, [lastPeriod, cycleLength]);

  // บันทึก dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSubmit = (period, length) => {
    setLastPeriod(period);
    setCycleLength(length);
    setShowCalendar(true);
  };

  const handleReset = () => {
    setLastPeriod('');
    setCycleLength(28);
    setShowCalendar(false);
    localStorage.removeItem('ovulationData');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-top">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <h1>🎀 คำนวณวันตกไข่</h1>
        <p className="subtitle">ช่วยติดตามสุขภาพและการเจริญพันธุ์อย่างมีประสิทธิภาพ</p>
      </header>

      <main className="app-main">
        <InputForm 
          onSubmit={handleSubmit} 
          initialLength={cycleLength}
          initialPeriod={lastPeriod}
        />

        {lastPeriod && cycleLength && showCalendar && (
          <div className="results-section fade-in">
            <div className="results-header">
              <h2>📊 ผลการคำนวณ</h2>
              <button className="reset-btn" onClick={handleReset}>
                🔄 คำนวณใหม่
              </button>
            </div>
            <CycleInfo lastPeriod={lastPeriod} cycleLength={cycleLength} />
            <CycleCalendar lastPeriod={lastPeriod} cycleLength={cycleLength} />
            <OvulationInfo />
            <CycleTips />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>💡 ข้อมูลนี้เป็นการคำนวณโดยประมาณ แนะนำให้ปรึกษาแพทย์สำหรับความแม่นยำที่สูงขึ้น</p>
        <p className="copyright">© 2025 Ovulation Calculator</p>
      </footer>
    </div>
  );
}

export default App;
