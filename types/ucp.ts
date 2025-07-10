export interface UCPData {
  projectName?: string;
  projectDescription?: string;
  useCases: Array<{
    id: number;
    name: string;
    complexity: string;
    weight: number;
  }>;
  actors: Array<{
    id: number;
    name: string;
    complexity: string;
    weight: number;
  }>;
  tcf: Record<string, number>;
  ecf: Record<string, number>;
}

export interface UCPResults {
  uaw: number
  uucw: number
  uucp: number
  tcfValue: number
  ecfValue: number
  ucp: number
  factorsBelow3: number
  factorsAbove3: number
  totalFactors: number
  productivityFactor: number
  effort: number
}

export interface TableCell {
  value: string | number;
  align?: 'left' | 'right';
} 