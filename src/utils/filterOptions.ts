export const accountFilterOptions = [
  { value: '3', label: 'Owner' },
  { value: '4', label: 'Secretary' },
  { value: '5', label: 'Photographer' },
  { value: '6', label: 'Editor' },
  { value: '1', label: 'Clients' },
] as const;

export const workloadFilterOptions = [
  { value: '0', label: 'All' },
  { value: '1', label: 'Unassigned' },
  { value: '2', label: 'Scheduled' },
  { value: '3', label: 'Uploaded' },
  { value: '4', label: 'For Edit' },
  { value: '5', label: 'Editing' },
  { value: '6', label: 'For Release' },
  { value: '7', label: 'Completed' },
] as const;

export type AccountFilterOption = typeof accountFilterOptions[number];
export type WorkloadFilterOption = typeof workloadFilterOptions[number];
