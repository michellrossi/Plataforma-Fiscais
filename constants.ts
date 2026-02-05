import { PosturaType, Subprefeitura } from './types';

export const POSTURAS: PosturaType[] = [
  'Todas',
  'Obras',
  'MPL',
  'Atividades',
  'Ambulantes',
  'Publicidade',
  'Área Pública',
  'POP',
  'Defesa Civil',
  'Outras'
];

export const POSTURA_COLORS: Record<PosturaType, { bg: string, border: string, text: string, iconColor: string, active: string, inactive: string }> = {
  'Todas': { 
    bg: 'bg-slate-50/50',
    border: 'border-slate-400',
    text: 'text-slate-700', 
    iconColor: 'text-slate-500',
    active: 'bg-slate-700 text-white shadow-sm',
    inactive: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
  },
  'Obras': { 
    bg: 'bg-blue-50/30',
    border: 'border-blue-500',
    text: 'text-blue-700', 
    iconColor: 'text-blue-500',
    active: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  },
  'MPL': { 
    bg: 'bg-emerald-50/30',
    border: 'border-emerald-500',
    text: 'text-emerald-700', 
    iconColor: 'text-emerald-500',
    active: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
  },
  'Atividades': { 
    bg: 'bg-amber-50/30',
    border: 'border-amber-500',
    text: 'text-amber-700', 
    iconColor: 'text-amber-500',
    active: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    inactive: 'bg-amber-50 text-amber-600 hover:bg-amber-100'
  },
  'Ambulantes': { 
    bg: 'bg-purple-50/30',
    border: 'border-purple-500',
    text: 'text-purple-700', 
    iconColor: 'text-purple-500',
    active: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
    inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
  },
  'Publicidade': { 
    bg: 'bg-rose-50/30',
    border: 'border-rose-500',
    text: 'text-rose-700', 
    iconColor: 'text-rose-500',
    active: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
    inactive: 'bg-rose-50 text-rose-600 hover:bg-rose-100'
  },
  'Área Pública': { 
    bg: 'bg-cyan-50/30',
    border: 'border-cyan-500',
    text: 'text-cyan-700', 
    iconColor: 'text-cyan-500',
    active: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200',
    inactive: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
  },
  'POP': { 
    bg: 'bg-indigo-50/30',
    border: 'border-indigo-500',
    text: 'text-indigo-700', 
    iconColor: 'text-indigo-500',
    active: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
    inactive: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
  },
  'Defesa Civil': { 
    bg: 'bg-red-50/30',
    border: 'border-red-500',
    text: 'text-red-700', 
    iconColor: 'text-red-500',
    active: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    inactive: 'bg-red-50 text-red-600 hover:bg-red-100'
  },
  'Outras': { 
    bg: 'bg-orange-50/30',
    border: 'border-orange-500',
    text: 'text-orange-700', 
    iconColor: 'text-orange-500',
    active: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    inactive: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
  },
};

export const SUBPREFEITURAS: Subprefeitura[] = [
  { id: 'penha', name: 'Subprefeitura Penha', region: 'Leste' }
];

export const CONTENT_TYPES = [
  { value: 'Todas', label: 'Todos os Tipos', color: 'bg-slate-100 text-slate-800', iconBg: 'bg-slate-100', iconText: 'text-slate-500' },
  { value: 'Dica', label: 'Dica Prática', color: 'bg-yellow-100 text-yellow-800', iconBg: 'bg-yellow-100', iconText: 'text-yellow-700' },
  { value: 'Resumo', label: 'Resumo', color: 'bg-blue-100 text-blue-800', iconBg: 'bg-blue-100', iconText: 'text-blue-700' },
  { value: 'Risco', label: 'Risco / Alerta', color: 'bg-red-100 text-red-800', iconBg: 'bg-red-100', iconText: 'text-red-700' },
  { value: 'Documento', label: 'Documento', color: 'bg-purple-100 text-purple-800', iconBg: 'bg-purple-100', iconText: 'text-purple-700' },
];