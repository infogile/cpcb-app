interface Kra {
  title: string;
}

interface Inspection {
  category: string;
  kra: Kra[];
}

export interface IFactory {
  inspections: Inspection[];
}
