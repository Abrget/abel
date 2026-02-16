import React from 'react';

const AddressBanner: React.FC = () => (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4 flex flex-wrap justify-center items-center gap-2 md:gap-6 text-sm">
        <span className="font-bold">🏛️ አራዳ ም/ጽ/ቤት</span>
        <span className="hidden md:inline">|</span>
        <span>📞 0111-56-23-25</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">📍 ከጊዮርጊስ ቤ/ክርስቲያን ከፍ ብሎ አዲስ አበባ ፖሊስ ኮሚሽን ፊት ለፊት</span>
    </div>
);

export default AddressBanner;
