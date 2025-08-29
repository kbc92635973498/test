import React, { createContext, useContext, useState } from 'react';

export interface VulnerabilityData {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  port: number;
  description: string;
  impact: string;
  solution: string;
  cveId?: string;
}

export interface ScanResults {
  timestamp: string;
  targetUrl: string;
  scanType: 'bulk' | 'detailed';
  openPorts: number[];
  vulnerabilities: VulnerabilityData[];
  riskScore: number;
}

interface ScanContextType {
  scanResults: ScanResults | null;
  isScanning: boolean;
  startScan: (url: string, scanType: 'bulk' | 'detailed', options?: string[]) => Promise<void>;
  clearResults: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const mockVulnerabilities: VulnerabilityData[] = [
    {
      id: '1',
      type: 'SQL Injection',
      severity: 'critical',
      port: 80,
      description: 'SQL injection vulnerability detected in login form',
      impact: 'Attackers can access sensitive database information',
      solution: 'Use parameterized queries and input validation',
      cveId: 'CVE-2023-1234'
    },
    {
      id: '2',
      type: 'XSS',
      severity: 'high',
      port: 443,
      description: 'Cross-site scripting vulnerability in search functionality',
      impact: 'Malicious scripts can be executed in user browsers',
      solution: 'Implement proper input sanitization and CSP headers'
    },
    {
      id: '3',
      type: 'Directory Traversal',
      severity: 'medium',
      port: 80,
      description: 'Directory traversal vulnerability in file upload',
      impact: 'Unauthorized access to server files',
      solution: 'Validate file paths and implement access controls'
    },
    {
      id: '4',
      type: 'Open Port',
      severity: 'medium',
      port: 22,
      description: 'SSH service running on default port',
      impact: 'Potential brute force attacks',
      solution: 'Change default port and implement fail2ban'
    },
    {
      id: '5',
      type: 'Weak SSL/TLS',
      severity: 'high',
      port: 443,
      description: 'Weak SSL/TLS configuration detected',
      impact: 'Man-in-the-middle attacks possible',
      solution: 'Update SSL/TLS configuration and disable weak ciphers'
    }
  ];

  const startScan = async (url: string, scanType: 'bulk' | 'detailed', options?: string[]): Promise<void> => {
    setIsScanning(true);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const vulnerabilities = scanType === 'detailed' && options?.length 
      ? mockVulnerabilities.filter(v => options.includes(v.type))
      : mockVulnerabilities;

    const results: ScanResults = {
      timestamp: new Date().toISOString(),
      targetUrl: url,
      scanType,
      openPorts: [22, 80, 443, 3306, 8080],
      vulnerabilities,
      riskScore: Math.round(vulnerabilities.reduce((score, v) => {
        const weights = { low: 1, medium: 2, high: 3, critical: 4 };
        return score + weights[v.severity];
      }, 0) / vulnerabilities.length * 25)
    };

    setScanResults(results);
    setIsScanning(false);
  };

  const clearResults = () => {
    setScanResults(null);
  };

  return (
    <ScanContext.Provider value={{ scanResults, isScanning, startScan, clearResults }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}