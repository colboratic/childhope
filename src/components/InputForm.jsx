import React, { useState, useEffect } from 'react';

function InputForm({ onSubmit, initialLength, initialPeriod }) {
  const [lastPeriodDate, setLastPeriodDate] = useState(initialPeriod || '');
  const [cycleLength, setCycleLength] = useState(initialLength || 28);
  const [isLoading, setIsLoading] = useState(false);

  // อัพเดทค่าเมื่อ props เปลี่ยน
  useEffect(() => {
    if (initialPeriod) setLastPeriodDate(initialPeriod);
  }, [initialPeriod]);

  useEffect(() => {
    if (initialLength) setCycleLength(initialLength);
  }, [initialLength]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lastPeriodDate) {
      alert('กรุณากรอกวันเริ่มรอบเดือนค่ะ 📅');
      return;
    }
    
    setIsLoading(true);
    // จำลอง loading effect
    setTimeout(() => {
      onSubmit(lastPeriodDate, cycleLength);
      setIsLoading(false);
    }, 500);
  };

  // คำนวณจำนวนวันที่ผ่านมา
  const getDaysAgo = () => {
    if (!lastPeriodDate) return null;
    const diff = Math.floor((new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'วันนี้';
    if (diff === 1) return 'เมื่อวาน';
    if (diff < 0) return `อีก ${Math.abs(diff)} วัน`;
    return `${diff} วันที่แล้ว`;
  };

  // คำนวณ cycle type
  const getCycleType = () => {
    if (cycleLength < 25) return { text: 'รอบสั้น', color: '#ff6b6b' };
    if (cycleLength > 30) return { text: 'รอบยาว', color: '#4ecdc4' };
    return { text: 'รอบปกติ', color: '#6bcf7f' };
  };

  const cycleType = getCycleType();

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <span className="form-icon">✨</span>
        <h2>กรอกข้อมูลของคุณ</h2>
      </div>

      <div className="form-group">
        <label htmlFor="lastPeriod">
          📅 วันเริ่มรอบเดือนครั้งล่าสุด
        </label>
        <input
          type="date"
          id="lastPeriod"
          value={lastPeriodDate}
          onChange={(e) => setLastPeriodDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
        {lastPeriodDate && (
          <small className="date-info">
            🕐 {getDaysAgo()}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="cycleLength">
          ⏳ จำนวนวันรอบเดือน
          <span className="cycle-badge" style={{ backgroundColor: cycleType.color }}>
            {cycleType.text}
          </span>
        </label>
        <div className="range-container">
          <span className="range-value">21</span>
          <input
            type="range"
            id="cycleLength"
            min="21"
            max="35"
            value={cycleLength}
            onChange={(e) => setCycleLength(parseInt(e.target.value))}
            className="range-input"
          />
          <span className="range-value">35</span>
        </div>
        <div className="cycle-display">
          <input
            type="number"
            min="21"
            max="35"
            value={cycleLength}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 21 && val <= 35) setCycleLength(val);
            }}
            className="cycle-number-input"
          />
          <span className="cycle-unit">วัน</span>
        </div>
      </div>

      <button 
        type="submit" 
        className={`submit-btn ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            กำลังคำนวณ...
          </>
        ) : (
          <>🎯 คำนวณรอบเดือน</>
        )}
      </button>
    </form>
  );
}

export default InputForm;
