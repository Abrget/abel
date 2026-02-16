export const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateCaseNumber = (station: string) => {
    const year = new Date().getFullYear();
    const psCode = station.replace('station-', 'PS0');
    const seq = String(Math.floor(Math.random() * 900) + 100);
    return `C-${year}-${psCode}-${seq}`;
};

export const generatePrisonerId = (station: string) => {
    const year = new Date().getFullYear();
    const psCode = station.replace('station-', 'PS0');
    const seq = String(Math.floor(Math.random() * 900) + 100);
    return `PRN-${year}-${psCode}-${seq}`;
};

export const formatDate = (date: string) => new Date(date).toLocaleDateString('am-ET');

export const getDaysDiff = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};
