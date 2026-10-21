export interface ScholarshipAllocationItem {
  id: string;
  name: string;
  description?: string;
}

export interface ScholarshipSubtypeItem {
  id: string;
  name: string;
  allocations: ScholarshipAllocationItem[];
}

export interface ScholarshipCategoryItem {
  id: string;
  name: string;
  subtypes: ScholarshipSubtypeItem[];
}

export const INITIAL_SCHOLARSHIP_CATEGORIES: ScholarshipCategoryItem[] = [
  {
    id: 'internally-funded',
    name: 'Internally-Funded',
    subtypes: [
      {
        id: 'entrance',
        name: 'Entrance',
        allocations: [
          { id: 'valedictorian', name: 'Valedictorian' },
          { id: 'salutatorian', name: 'Salutatorian' }
        ]
      },
      {
        id: 'academic',
        name: 'Academic',
        allocations: [
          { id: 'full', name: 'Full (1.00 - 1.25)' },
          { id: 'partial', name: 'Partial (1.26 - 1.45)' },
          { id: 'regional-acad', name: 'Regional' },
          { id: 'national-acad', name: 'National' }
        ]
      },
      {
        id: 'socio-cultural',
        name: 'Socio-cultural',
        allocations: [
          { id: 'sc-regional', name: 'Regional' },
          { id: 'sc-national', name: 'National' }
        ]
      },
      {
        id: 'institutional',
        name: 'Institutional',
        allocations: [
          { id: 'dep-faculty', name: 'Dependent of Faculty or Staff' },
          { id: 'pres-ssc', name: 'President – SSC' },
          { id: 'pres-flp', name: 'President – FLP' },
          { id: 'editor-in-chief', name: 'Editor-in-Chief' },
          { id: 'capsu-band', name: 'CAPSU Band / Chorale' },
          { id: 'others', name: 'Others' }
        ]
      }
    ]
  },
  {
    id: 'externally-funded',
    name: 'Externally-Funded',
    subtypes: [
      {
        id: 'ched',
        name: 'CHED',
        allocations: [
          { id: 'tes', name: 'Tertiary Education Subsidy (TES)' },
          { id: 'pag-ulikid', name: 'Pag-ulikid' },
          { id: 'tulong-dunong', name: 'Tulong Dunong' },
          { id: 'anac-ip', name: 'ANAC - IP' },
          { id: 'brgy-officials', name: 'Barangay (Legal dependents of Brgy. Officials)' },
          { id: 'esgp-pa', name: 'ESGP - PA' },
          { id: 'unifast', name: 'UniFast' },
          { id: 'congressional-district', name: 'Congressional District' },
          { id: 'one-town', name: 'One Town One Scholar' },
          { id: 'ched-others', name: 'Others' }
        ]
      },
      {
        id: 'merit',
        name: 'Merit',
        allocations: [
          { id: 'dost', name: 'DOST' },
          { id: 'vic', name: 'VIC' },
          { id: 'capizeno-circle', name: 'Capizeño Circle' },
          { id: 'grf', name: 'GRF' },
          { id: 'ched', name: 'CHED' },
          { id: 'merit-others', name: 'Others' }
        ]
      },
      {
        id: 'lgu',
        name: 'LGU',
        allocations: [
          { id: 'lgu-grant', name: 'LGU: Barangay, Municipality, Province' }
        ]
      },
      {
        id: 'dswd',
        name: 'DSWD',
        allocations: [
          { id: 'dswd-grant', name: 'DSWD Educational Assistance' }
        ]
      }
    ]
  }
];

export function getStoredScholarshipCategories(): ScholarshipCategoryItem[] {
  if (typeof window === 'undefined') return INITIAL_SCHOLARSHIP_CATEGORIES;
  try {
    const saved = localStorage.getItem('capsu_scholarship_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SCHOLARSHIP_CATEGORIES;
}

export function saveStoredScholarshipCategories(categories: ScholarshipCategoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('capsu_scholarship_categories', JSON.stringify(categories));
    window.dispatchEvent(new Event('scholarship_categories_updated'));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Returns dynamic scholarship hierarchy Record<categoryName, Record<subtypeName, allocationNames[]>>
 * synchronized with centralized storage.
 */
export function getDynamicScholarshipHierarchy(): Record<string, Record<string, string[]>> {
  const categories = getStoredScholarshipCategories();
  const hierarchy: Record<string, Record<string, string[]>> = {};

  categories.forEach(cat => {
    hierarchy[cat.name] = {};
    (cat.subtypes || []).forEach(sub => {
      hierarchy[cat.name][sub.name] = (sub.allocations || []).map(a => a.name);
    });
  });

  return hierarchy;
}

export interface ScholarshipOption {
  id: string;
  name: string;
  label: string;
  hasSpecifyField?: 'internalCategoryOthers' | 'chedCongressionalDistrict' | 'chedOneTown' | 'chedTulongDunong' | 'chedOthers' | 'lguContact' | 'dswdFields' | 'meritChedAndOthers';
}

export interface ScholarshipSubCategoryGroup {
  subCategory: string;
  title: string;
  description?: string;
  options: ScholarshipOption[];
}

export interface ScholarshipStructure {
  Internal: ScholarshipSubCategoryGroup[];
  External: ScholarshipSubCategoryGroup[];
}

export function getDynamicScholarshipStructure(): ScholarshipStructure {
  const cats = getStoredScholarshipCategories();
  const internalCat = cats.find(c => c.id === 'internally-funded' || c.name === 'Internally-Funded') || cats[0];
  const externalCat = cats.find(c => c.id === 'externally-funded' || c.name === 'Externally-Funded') || cats[1];

  const mapSubtypes = (subtypes: ScholarshipSubtypeItem[]): ScholarshipSubCategoryGroup[] => {
    return (subtypes || []).map(sub => ({
      subCategory: sub.name,
      title: sub.name,
      description: '',
      options: (sub.allocations || []).map(alloc => ({
        id: alloc.name,
        name: alloc.name,
        label: alloc.name,
        hasSpecifyField: alloc.name.toLowerCase().includes('others') ? 'internalCategoryOthers' : undefined
      }))
    }));
  };

  return {
    Internal: mapSubtypes(internalCat?.subtypes || []),
    External: mapSubtypes(externalCat?.subtypes || [])
  };
}

/**
 * Helper to find which subCategory and fundType an option belongs to
 */
export function findScholarshipInfo(scholarshipIdOrName: string): {
  found: boolean;
  fundType: 'Internal' | 'External' | null;
  subCategory: string | null;
  option: ScholarshipOption | null;
} {
  const structure = getDynamicScholarshipStructure();
  for (const fundType of ['Internal', 'External'] as const) {
    for (const group of structure[fundType]) {
      const match = group.options.find(
        o => o.id === scholarshipIdOrName || o.name === scholarshipIdOrName || o.label === scholarshipIdOrName
      );
      if (match) {
        return {
          found: true,
          fundType,
          subCategory: group.subCategory,
          option: match
        };
      }
    }
  }
  return { found: false, fundType: null, subCategory: null, option: null };
}

/**
 * Formats scholarship allocations for display, reports, reviews, and receipts
 */
export function formatScholarshipAllocations(data: {
  scholarshipFundType?: string;
  scholarshipSubCategory?: string;
  selectedScholarships?: string[];
  internalCategory?: string;
  externalCategory?: string;
  internalCategoryOthers?: string;
  chedCongressionalDistrict?: string;
  chedOneTown?: string;
  chedTulongDunong?: string;
  chedOthers?: string;
  lguContact?: string;
  dswdMunicipality?: string;
  dswdContact?: string;
  dswdDesignation?: string;
  dswdOthers?: string;
  scholarshipType?: string;
  [key: string]: any;
}): {
  fundType: string;
  category: string;
  items: string[];
  displayItems: string[];
  fullLabel: string;
  shortLabel: string;
  count: number;
} {
  let selected = Array.isArray(data.selectedScholarships) ? [...data.selectedScholarships] : [];

  // Fallback if selectedScholarships array isn't populated directly
  if (selected.length === 0) {
    if (data.scholarshipFundType === 'Internal' && data.internalCategory) {
      selected = data.internalCategory.split(',').map(s => s.trim()).filter(Boolean);
    } else if (data.scholarshipFundType === 'External' && data.externalCategory) {
      selected = data.externalCategory.split(',').map(s => s.trim()).filter(Boolean);
    } else if (data.internalCategory) {
      selected = data.internalCategory.split(',').map(s => s.trim()).filter(Boolean);
    } else if (data.externalCategory) {
      selected = data.externalCategory.split(',').map(s => s.trim()).filter(Boolean);
    } else if (data.scholarshipType) {
      selected = [data.scholarshipType];
    }
  }

  // Determine fundType and category
  let fundType = data.scholarshipFundType || '';
  let subCategory = data.scholarshipSubCategory || '';

  if ((!fundType || !subCategory) && selected.length > 0) {
    const firstInfo = findScholarshipInfo(selected[0]);
    if (firstInfo.found) {
      fundType = fundType || firstInfo.fundType || 'External';
      subCategory = subCategory || firstInfo.subCategory || 'CHED';
    }
  }

  fundType = fundType === 'Internal' ? 'Internally-Funded' : fundType === 'External' ? 'Externally-Funded' : (fundType || 'Externally-Funded');
  subCategory = subCategory || (fundType === 'Internally-Funded' ? 'Institutional' : 'CHED');

  // Format detailed item labels
  const displayItems = selected.map(item => {
    if (item === 'SC-Regional') return 'Socio-cultural (Regional)';
    if (item === 'SC-National') return 'Socio-cultural (National)';
    if (item === 'Congressional District' && data.chedCongressionalDistrict) {
      return `Congressional District (${data.chedCongressionalDistrict})`;
    }
    if (item === 'One Town One Scholar' && data.chedOneTown) {
      return `One Town One Scholar (${data.chedOneTown})`;
    }
    if (item === 'Tulong Dunong' && data.chedTulongDunong) {
      return `Tulong Dunong (${data.chedTulongDunong})`;
    }
    if (item === 'Others' && data.chedOthers) {
      return `Others (${data.chedOthers})`;
    }
    if (item === 'Others' && data.internalCategoryOthers) {
      return `Others (${data.internalCategoryOthers})`;
    }
    if (item === 'CHED and Others' && data.meritChedAndOthers) {
      return `CHED and Others (${data.meritChedAndOthers})`;
    }
    if (item === 'Others' && data.meritChedAndOthers) {
      return `Others (${data.meritChedAndOthers})`;
    }
    if (item === 'LGU' && data.lguContact) {
      return `LGU (Contact: ${data.lguContact})`;
    }
    if (item === 'DSWD') {
      const dswdParts = [
        data.dswdMunicipality ? `Mun: ${data.dswdMunicipality}` : '',
        data.dswdContact ? `Contact: ${data.dswdContact}` : '',
        data.dswdDesignation ? `Desig: ${data.dswdDesignation}` : ''
      ].filter(Boolean);
      return dswdParts.length > 0 ? `DSWD (${dswdParts.join(', ')})` : 'DSWD Educational Assistance';
    }
    return item;
  });

  const joinedItems = displayItems.length > 0 ? displayItems.join(' & ') : 'No Scholarship Selected';
  const fullLabel = selected.length > 0 
    ? `${fundType} — ${subCategory} (${joinedItems})`
    : 'No Scholarship Selected';

  const shortLabel = selected.length > 0 
    ? `${subCategory}: ${joinedItems}`
    : 'None';

  return {
    fundType,
    category: subCategory,
    items: selected,
    displayItems,
    fullLabel,
    shortLabel,
    count: selected.length
  };
}
