export type UserRole = 'police' | 'prosecutor' | 'teamleader' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  station?: string; // For police
  prosecutorId?: string; // For prosecutors (PROS-01 to PROS-07)
  specialization?: string; // For prosecutors
  maxCases: number; // Load balancing
}

export type CaseStatus = 
  | 'ዲዳ'           // Draft
  | 'ተጠናቀቀ'       // Finalized
  | 'ወደ ዐቃቤ ህግ ተላከ'  // Sent to prosecution
  | 'ተቀባይነት'      // Received
  | 'መስጠት'        // Assigned
  | 'መርማራ'        // Investigation
  | 'አንቀጽ 38'     // Article 38
  | 'አንቀጽ 42'     // Article 42
  | 'ወንጀል ክስ'    // Formal Charge
  | 'ወደ ፍርድ ቤት'  // Sent to court
  | 'ተጠናቀቀ';      // Completed

export type CrimeType = 
  | 'ግድያ'        // Murder
  | 'ሞገስ'        // Assault
  | 'ስርቆት'       // Theft
  | 'ስንቅ'        // Robbery
  | 'ቅማሸት'       // Fraud
  | 'ወንጀል ክስ'   // Formal Charge
  | 'አደንዛዥ'      // Drug
  | 'ሌላ';         // Other

export type CustodyType = 'RTD' | 'TOB'; // Release to Debug / Taken on Bail

export interface Case {
  id: string;
  caseNumber: string;
  
  // Criminal Info
  suspectName: string;
  suspectAge: number;
  suspectGender: 'ወንጀለኛ' | 'ወንጀለኛምላክ';
  crimeType: CrimeType;
  crimeDescription: string;
  crimeLevel: 'ቀላል' | 'አማካይ' | 'ከባድ';
  
  // Police Info
  station: string;
  policeOfficer: string;
  arrestDate: string;
  releaseDate?: string;
  
  // Status
  status: CaseStatus;
  sentToProsecutionDate?: string;
  currentStep: number; // 1-7 for prosecution
  
  // Assignment
  assignedProsecutorId?: string;
  assignedProsecutorName?: string;
  
  // Article 38/42/Charge
  article38Date?: string;
  article38Deadline?: string;
  article38Reason?: string;
  article42Reason?: string;
  chargeType?: string;
  custodyType?: CustodyType;
  
  // Court
  courtDate?: string;
  courtDecision?: string;
  
  // Prisoner Link
  prisonerId?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  history: CaseHistory[];
}

export interface CaseHistory {
  date: string;
  action: string;
  user: string;
  details: string;
}

// Prisoner Registry Types
export type PrisonerStatus = 'IN_CUSTODY' | 'RELEASED' | 'TRANSFERRED';

export interface Prisoner {
  id: string;
  prisonerId: string;
  fullName: string;
  alias?: string;
  photo?: string;
  gender: 'ወንጀለኛ' | 'ወንጀለኛምላክ';
  age: number;
  arrestDate: string;
  arrestingStation: string;
  detentionFacility: string;
  cellNumber?: string;
  healthNotes?: string;
  status: PrisonerStatus;
  relatedCaseId?: string;
  releaseDate?: string;
  releaseReason?: string;
  transferTo?: string;
  createdBy: string;
  createdAt: string;
  visitors: VisitorLog[];
}

export interface VisitorLog {
  date: string;
  visitorName: string;
  relation: string;
  notes?: string;
}

// Notifications/Alerts
export type AlertType = 'urgent' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  relatedCaseId?: string;
  relatedPrisonerId?: string;
  createdAt: string;
  isRead: boolean;
}

// Prosecutor Specializations (Updated with actual names)
export const PROSECUTOR_SPECIALIZATIONS: Record<string, string> = {
  'PROS-01': 'የፀጥታ ወንጀሎች',        // Peace & Security Crimes
  'PROS-02': 'ስርቆት',                  // Property Crimes & Theft
  'PROS-03': 'ቅማሸት',                  // Corruption & Financial Crimes
  'PROS-04': 'አደንዛዥ ወንጀሎች',       // Narcotics
  'PROS-05': 'የኮምፒውተር ወንጀሎች',    // Cybercrime
  'PROS-06': 'የቤት የሕግ ጉዳዮች',      // Domestic & Juvenile Issues
  'PROS-07': 'ጥቃት',                    // General Assault
};

// Prosecutor Names (English)
export const PROSECUTOR_NAMES: Record<string, string> = {
  'PROS-01': 'Pros. Fikadu Alemayehu',
  'PROS-02': 'Pros. Minista Getachew',
  'PROS-03': 'Pros. Adisu Hailemichael',
  'PROS-04': 'Pros. Samson Tesfaye',
  'PROS-05': 'Pros. Wendwesen Demse',
  'PROS-06': 'Pros. Birhan Eshetu',
  'PROS-07': 'Pros. Amha Takalign',
};

// Prosecutor Names (Amharic)
export const PROSECUTOR_NAMES_AMHARIC: Record<string, string> = {
  'PROS-01': 'ፍቃዱ አለማየሁ',
  'PROS-02': 'ሚኒስታ ጌታቸው',
  'PROS-03': 'አዲሱ ኃይለሚካኤል',
  'PROS-04': 'ሳምሶን ተስፋዬ',
  'PROS-05': 'ወንድወሰን ደምሴ',
  'PROS-06': 'ብርሃን እሸቱ',
  'PROS-07': 'አምሃ ተካልኝ',
};

// Station Names
export const STATIONS: Record<string, string> = {
  'station-1': 'ጃል ሜዳ',
  'station-2': 'አራት ኪሎ',
  'station-3': 'ፒያሳ',
  'station-4': 'ራስ ደስታ',
  'station-5': 'አትክልት ጠራ',
  'station-6': 'ሜምርያ',
  'station-7': 'ቀበና',
};

// Workflow Steps for Prosecution
export const PROSECUTION_STEPS = [
  { step: 1, name: 'ተቀባይነት', description: 'ጉዳዩን ተቀብሎ መስጠት' },
  { step: 2, name: 'መስጠት', description: 'ለተወሰነ ዐቃቤ ህግ መስጠት' },
  { step: 3, name: 'መርማራ', description: 'ጉዳዩን መርማር ውሳኔ ለመስጠት' },
  { step: 4, name: 'ውሳኔ', description: 'አንቀጽ 38/42 ወይም ክስ' },
  { step: 5, name: 'ፍርድ ቤት', description: 'ወደ ፍርድ ቤት ላክ' },
  { step: 6, name: 'መዝግያ', description: 'የፍርድ ቤት ውሳኔ መዝግያ' },
  { step: 7, name: 'ተጠናቀቀ', description: 'ጉዳዩ ተጠናቀቀ' },
];

// App Context Type
export interface AppContextType {
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
}
