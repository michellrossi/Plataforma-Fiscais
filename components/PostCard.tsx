import React from 'react';
import { Post } from '../types';
import { SUBPREFEITURAS, CONTENT_TYPES, POSTURA_COLORS } from '../constants';
import { Trash2, Eye, Pencil, Calendar, User, Lightbulb, BookOpen, FileText, AlertTriangle } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
  onView: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onEdit, onView }) => {
  const posturaStyle = POSTURA_COLORS[post.postura] || POSTURA_COLORS['Todas'];

  // Dados visuais baseados no Tipo
  const getTypeData = () => {
    switch (post.type) {
      case 'Dica': return { icon: <Lightbulb className="w-6 h-6" />, color: 'text-amber-500', bg: 'bg-amber-50' };
      case 'Resumo': return { icon: <BookOpen className="w-6 h-6" />, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'Documento': return { icon: <FileText className="w-6 h-6" />, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'Risco': return { icon: <AlertTriangle className="w-6 h-6" />, color: 'text-rose-500', bg: 'bg-rose-50' };
      default: return { icon: <BookOpen className="w-6 h-6" />, color: 'text-blue-500', bg: 'bg-blue-50' };
    }
  };

  const typeData = getTypeData();

  // Formatação robusta de data
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(post.createdAt));

  return (
    <div 
      onClick={() => onView(post)}
      className={`relative bg-white rounded-[24px] border-l-[6px] ${posturaStyle.border} shadow-sm flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-y border-r border-slate-100 group cursor-pointer`}
    >
      
      {/* HEADER: ÍCONE E AÇÕES */}
      <div className="p-6 flex justify-between items-start">
        {/* Caixa de Ícone conforme Tipo */}
        <div className={`w-12 h-12 ${typeData.bg} ${typeData.color} rounded-[16px] flex items-center justify-center shadow-sm`}>
          {typeData.icon}
        </div>

        {/* Grupo de Ações (Topo Direito) */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {/* Botão de visualizar removido pois o card inteiro é clicável */}
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(post); }} 
            className="p-2 text-blue-400 hover:text-blue-600 transition-colors" 
            title="Editar"
          >
            <Pencil className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); if(confirm('Excluir este registro permanentemente?')) onDelete(post.id); }} 
            className="p-2 text-rose-400 hover:text-rose-600 transition-colors" 
            title="Excluir"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* CORPO: TEXTOS E BADGES */}
      <div className="px-6 flex-1 flex flex-col">
        {/* Título: Negrito Máximo e Uppercase */}
        <h3 className="font-[900] text-[#1e293b] text-[15px] mb-3 uppercase leading-tight tracking-tight">
          {post.title}
        </h3>
        
        {/* Conteúdo: Cinza com line-clamp */}
        <p className="text-[#64748b] text-[13.5px] mb-8 leading-relaxed font-medium line-clamp-4 flex-1">
          {post.content}
        </p>

        {/* Badge de Postura */}
        <div className="flex gap-2 mb-6 flex-wrap mt-auto">
          <span className="px-3 py-1.5 bg-slate-100 text-[#475569] text-[10px] font-bold rounded-lg border border-slate-200/50">
            {post.postura}
          </span>
        </div>
      </div>

      {/* RODAPÉ: AUTOR E DATA */}
      <div className="px-6 py-4 border-t border-slate-50 bg-[#fafbfc]/80 flex justify-between items-center">
        {/* Autor */}
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold tracking-wider uppercase truncate max-w-[120px]">
            {post.author || 'Michell Rossi'}
          </span>
        </div>
        
        {/* Data */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;