export const SKILL_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'HTML/CSS',
  'Python',
  'Java',
  'C++',
  'Git',
  'Docker'
];

export const DEFAULT_CANDIDATE_FORM = {
  full_name: '',
  phone_number: '',
  email: '',
  interview_level: 'intern',
  gender: '',
  preferred_stack: '',
  skills: []
};
 
export const STATUS = {
  pending: 'pending',
  interviewed: 'interviewed',
  hired: 'hired',
  rejected:'rejected',
}
export const LEVEL_OPTIONS = [
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' }
];