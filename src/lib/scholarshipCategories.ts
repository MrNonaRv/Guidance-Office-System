export interface ScholarshipOption {
  id: string;
  name: string;
  label: string;
  hasSpecifyField?: 'internalCategoryOthers' | 'chedCongressionalDistrict' | 'chedOneTown' | 'chedTulongDunong' | 'chedOthers' | 'lguContact' | 'dswdFields';
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

export const SCHOLARSHIP_STRUCTURE: ScholarshipStructure = {
  Internal: [
    {
      subCategory: 'Entrance',
      title: 'Entrance',
      description: 'Awarded to honor graduates upon entry.',
      options: [
        { id: 'Valedictorian', name: 'Valedictorian', label: 'Valedictorian' },
        { id: 'Salutatorian', name: 'Salutatorian', label: 'Salutatorian' }
      ]
    },
    {
      subCategory: 'Academic',
      title: 'Academic',
      description: 'Awarded based on academic standing and GWA.',
      options: [
        { id: 'Full', name: 'Full', label: 'Full' },
        { id: 'Partial', name: 'Partial', label: 'Partial' },
        { id: 'Regional', name: 'Regional', label: 'Regional' },
        { id: 'National', name: 'National', label: 'National' }
      ]
    },
    {
      subCategory: 'Socio-cultural',
      title: 'Socio-cultural',
      description: 'For socio-cultural, artistic, and athletic regional/national achievers.',
      options: [
        { id: 'SC-Regional', name: 'SC-Regional', label: 'Regional' },
        { id: 'SC-National', name: 'SC-National', label: 'National' }
      ]
    },
    {
      subCategory: 'Institutional',
      title: 'Institutional',
      description: 'University student leadership, publication, band, chorale, and staff grants.',
      options: [
        { id: 'Dependent of Faculty', name: 'Dependent of Faculty', label: 'Dependent of Faculty or Staff' },
        { id: 'President - SSC', name: 'President - SSC', label: 'President – SSC' },
        { id: 'President - FLP', name: 'President - FLP', label: 'President – FLP' },
        { id: 'Editor-in-Chief', name: 'Editor-in-Chief', label: 'Editor-in-Chief (Campus Publication)' },
        { id: 'CAPSU Band / Chorale', name: 'CAPSU Band / Chorale', label: 'CAPSU Band / Chorale' },
        { id: 'Others', name: 'Others', label: 'Others (specify)', hasSpecifyField: 'internalCategoryOthers' }
      ]
    }
  ],
  External: [
    {
      subCategory: 'CHED',
      title: 'CHED',
      description: 'Commission on Higher Education and UniFAST national scholarship programs.',
      options: [
        { id: 'ANAC - IP', name: 'ANAC - IP', label: 'ANAC - IP' },
        { id: 'Pag - ulikid', name: 'Pag - ulikid', label: 'Pag - ulikid' },
        { id: 'Barangay (Legal dependents of Brgy. Officials)', name: 'Barangay (Legal dependents of Brgy. Officials)', label: 'Barangay (Legal dependents of Brgy. Officials)' },
        { id: 'ESGP - PA', name: 'ESGP - PA', label: 'ESGP - PA' },
        { id: 'UniFast', name: 'UniFast', label: 'UniFast' },
        { id: 'Tertiary Education Subsidy (TES)', name: 'Tertiary Education Subsidy (TES)', label: 'Tertiary Education Subsidy (TES)' },
        { id: 'Congressional District', name: 'Congressional District', label: 'Congressional District (specify)', hasSpecifyField: 'chedCongressionalDistrict' },
        { id: 'One Town One Scholar', name: 'One Town One Scholar', label: 'One Town One Scholar (specify)', hasSpecifyField: 'chedOneTown' },
        { id: 'Tulong Dunong', name: 'Tulong Dunong', label: 'Tulong Dunong (specify)', hasSpecifyField: 'chedTulongDunong' },
        { id: 'Others', name: 'Others', label: 'Others (specify)', hasSpecifyField: 'chedOthers' }
      ]
    },
    {
      subCategory: 'Merit',
      title: 'Merit',
      description: 'Special merit and science foundations grants.',
      options: [
        { id: 'VIC', name: 'VIC', label: 'VIC' },
        { id: 'Capizeño Circle', name: 'Capizeño Circle', label: 'Capizeño Circle' },
        { id: 'DOST', name: 'DOST', label: 'DOST' },
        { id: 'GRF', name: 'GRF', label: 'GRF' }
      ]
    },
    {
      subCategory: 'LGU',
      title: 'LGU',
      description: 'Local Government Unit educational grants (Barangay, Municipality, Province).',
      options: [
        { id: 'LGU', name: 'LGU', label: 'LGU: Barangay, Municipality, Province (Landline) Contact person or issuing office:', hasSpecifyField: 'lguContact' }
      ]
    },
    {
      subCategory: 'DSWD',
      title: 'DSWD',
      description: 'Department of Social Welfare and Development educational assistance.',
      options: [
        { id: 'DSWD', name: 'DSWD', label: 'DSWD: Educational Assistance', hasSpecifyField: 'dswdFields' }
      ]
    }
  ]
};

/**
 * Helper to find which subCategory and fundType an option belongs to
 */
export function findScholarshipInfo(scholarshipIdOrName: string): {
  found: boolean;
  fundType: 'Internal' | 'External' | null;
  subCategory: string | null;
  option: ScholarshipOption | null;
} {
  for (const fundType of ['Internal', 'External'] as const) {
    for (const group of SCHOLARSHIP_STRUCTURE[fundType]) {
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
    if (item === 'LGU' && data.lguContact) {
      return `LGU (Contact: ${data.lguContact})`;
    }
    if (item === 'DSWD') {
      const dswdParts = [
        data.dswdMunicipality ? `Mun: ${data.dswdMunicipality}` : '',
        data.dswdContact ? `Contact: ${data.dswdContact}` : ''
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
