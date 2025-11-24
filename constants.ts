import { FlowerData, MonthData } from './types';

export const MONTHS: MonthData[] = [
  { id: 0, name: 'JAN', flowerId: 'carnation' },
  { id: 1, name: 'FEB', flowerId: 'violet' },
  { id: 2, name: 'MAR', flowerId: 'daffodil' },
  { id: 3, name: 'APR', flowerId: 'daisy' },
  { id: 4, name: 'MAY', flowerId: 'lily_valley' },
  { id: 5, name: 'JUN', flowerId: 'rose' },
  { id: 6, name: 'JUL', flowerId: 'larkspur' },
  { id: 7, name: 'AUG', flowerId: 'gladiolus' },
  { id: 8, name: 'SEP', flowerId: 'lotus' },
  { id: 9, name: 'OCT', flowerId: 'marigold' },
  { id: 10, name: 'NOV', flowerId: 'chrysanthemum' },
  { id: 11, name: 'DEC', flowerId: 'narcissus' },
];

export const FLOWER_DATA: FlowerData[] = [
  { 
    month: 'January', 
    name: 'Carnation', 
    meaning: 'Deep Love & Distinction', 
    color: 'bg-pink-200',
    textColor: 'text-pink-800',
    petalColor: 'text-pink-300',
    centerColor: 'text-pink-400'
  },
  { 
    month: 'February', 
    name: 'Violet', 
    meaning: 'Loyalty & Faithfulness', 
    color: 'bg-violet-300',
    textColor: 'text-violet-900',
    petalColor: 'text-violet-400',
    centerColor: 'text-yellow-300'
  },
  { 
    month: 'March', 
    name: 'Daffodil', 
    meaning: 'Rebirth & New Beginnings', 
    color: 'bg-yellow-200',
    textColor: 'text-yellow-800',
    petalColor: 'text-yellow-300',
    centerColor: 'text-orange-400'
  },
  { 
    month: 'April', 
    name: 'Daisy', 
    meaning: 'Innocence & Purity', 
    color: 'bg-white border border-yellow-200',
    textColor: 'text-yellow-600',
    petalColor: 'text-white', // Needs careful handling on white bg, but we can add shadow
    centerColor: 'text-yellow-400'
  },
  { 
    month: 'May', 
    name: 'Lily of the Valley', 
    meaning: 'Humility & Sweetness', 
    color: 'bg-green-100',
    textColor: 'text-green-800',
    petalColor: 'text-white',
    centerColor: 'text-green-200'
  },
  { 
    month: 'June', 
    name: 'Rose', 
    meaning: 'Love & Beauty', 
    color: 'bg-red-400',
    textColor: 'text-red-900',
    petalColor: 'text-red-500',
    centerColor: 'text-red-800'
  },
  { 
    month: 'July', 
    name: 'Larkspur', 
    meaning: 'Open Heart & Positivity', 
    color: 'bg-purple-300',
    textColor: 'text-purple-900',
    petalColor: 'text-purple-400',
    centerColor: 'text-white'
  },
  { 
    month: 'August', 
    name: 'Gladiolus', 
    meaning: 'Strength & Integrity', 
    color: 'bg-orange-300',
    textColor: 'text-orange-900',
    petalColor: 'text-orange-400',
    centerColor: 'text-red-400'
  },
  { 
    month: 'September', 
    name: 'Lotus', 
    meaning: 'Purity & Enlightenment', 
    color: 'bg-pink-300',
    textColor: 'text-pink-900',
    petalColor: 'text-pink-200',
    centerColor: 'text-yellow-200'
  },
  { 
    month: 'October', 
    name: 'Marigold', 
    meaning: 'Passion & Creativity', 
    color: 'bg-orange-500',
    textColor: 'text-orange-100',
    petalColor: 'text-orange-500',
    centerColor: 'text-yellow-500'
  },
  { 
    month: 'November', 
    name: 'Chrysanthemum', 
    meaning: 'Friendship & Joy', 
    color: 'bg-red-200',
    textColor: 'text-red-800',
    petalColor: 'text-red-300',
    centerColor: 'text-yellow-200'
  },
  { 
    month: 'December', 
    name: 'Narcissus', 
    meaning: 'Sweetness & Hope', 
    color: 'bg-gray-100',
    textColor: 'text-gray-600',
    petalColor: 'text-indigo-100',
    centerColor: 'text-yellow-300'
  },
];