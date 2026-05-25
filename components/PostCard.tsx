import React from 'react';
import { Post } from '../types';
import { CONTENT_TYPES, POSTURA_COLORS } from '../constants';
import { Trash2, Pencil, Calendar, User, Lightbulb, BookOpen, FileText, AlertTriangle, Link } from 'lucide-react';

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
      case 'Dica': return { icon: <Lightbulb className="w-4 h-4" />, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' };
      case 'Resumo': return { icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' };
      case 'Documento': return { icon: <FileText className="w-4 h-4" />, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' };
      case 'Risco': return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' };
      case 'Links': return { icon: <Link className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' };
      default: return { icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' };
    }
  };

  const typeData = getTypeData();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(post.createdAt));

  return (
    <div 
      onClick={() => onView(post)}
      className="group relative bg-white rounded-3xl p-5 aspect-square flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Topo do Card: Badge do Tema e Ícone do Tipo */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${posturaStyle.bg} ${posturaStyle.text} border border-current max-w-[70%] truncate`}>
          {post.postura}
        </span>
        <div className={`w-8 h-8 rounded-xl border ${typeData.bg} ${typeData.color} flex items-center justify-center shrink-0`}>
          {typeData.icon}
        </div>
      </div>

      {/* Meio: Título principal */}
      <div className="my-auto py-2 flex-1 flex flex-col justify-center">
        <h3 className="font-bold text-slate-800 text-[13px] md:text-[14px] leading-snug uppercase tracking-tight line-clamp-3 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
      </div>

      {/* Metadados e Ações */}
      <div className="border-t border-slate-100 pt-3 shrink-0 space-y-2">
        {/* Autor e Data */}
        <div className="flex flex-col gap-1">
          <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-full">{post.author || 'Anônimo'}</span>
          </span>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[9px] font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              {formattedDate}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
              {post.type}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-1 pt-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(post); }} 
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all" 
            title="Editar"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); if(confirm('Excluir este registro?')) onDelete(post.id); }} 
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all" 
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;