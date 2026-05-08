import React from 'react';
import { Post } from '../types';
import { SUBPREFEITURAS, CONTENT_TYPES, POSTURA_COLORS } from '../constants';
import { Trash2, Eye, Pencil, Calendar, User, Lightbulb, BookOpen, FileText, AlertTriangle, Link, ChevronRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
  onView: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onEdit, onView }) => {
  const posturaStyle = POSTURA_COLORS[post.postura] || POSTURA_COLORS['Todas'];

  const getTypeData = () => {
    switch (post.type) {
      case 'Dica': return { icon: <Lightbulb className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-100/50' };
      case 'Resumo': return { icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-100/50' };
      case 'Documento': return { icon: <FileText className="w-5 h-5" />, color: 'text-purple-500', bg: 'bg-purple-100/50' };
      case 'Risco': return { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-500', bg: 'bg-rose-100/50' };
      case 'Links': return { icon: <Link className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-100/50' };
      default: return { icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-100/50' };
    }
  };

  const typeData = getTypeData();
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(post.createdAt));

  return (
    <div 
      onClick={() => onView(post)}
      className="group relative bg-white rounded-2xl p-5 mb-4 flex items-center gap-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Ícone à Esquerda */}
      <div className={`w-14 h-14 shrink-0 ${typeData.bg} ${typeData.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        {typeData.icon}
      </div>

      {/* Informações Centrais */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          
          <div className="flex items-center gap-2">
             <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200`}>
              {post.type}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${posturaStyle.bg} ${posturaStyle.text} border border-current opacity-80`}>
              {post.postura}
            </span>
          </div>

          <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{post.author || 'Anônimo'}</span>
          </span>
        </div>
      </div>

      {/* Ações e Status à Direita */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end gap-1 px-4 border-r border-slate-100">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status</span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-emerald-100">
            ATIVO
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(post); }} 
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" 
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); if(confirm('Excluir este registro?')) onDelete(post.id); }} 
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" 
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="ml-2 text-slate-300 group-hover:text-indigo-400 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;