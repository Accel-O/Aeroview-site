import React from 'react';

const PollutantComparisonBar = ({ label, value, max, color }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                <span style={{ fontWeight: 'bold' }}>{value} µg/m³</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 1s ease-in-out', borderRadius: '10px' }} />
            </div>
        </div>
    );
};

export default PollutantComparisonBar;