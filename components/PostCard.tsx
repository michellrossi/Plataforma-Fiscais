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
  const typeConfig = CONTENT_TYPES.find(c => c.value === post.type) || CONTENT_TYPES[2]; 
  const posturaStyle = POSTURA_COLORS[post.postura] || POSTURA_COLORS['Todas'];

  const getIcon = () => {
    switch (post.type) {
      case 'Dica': return <Lightbulb className={`w-5 h-5 ${typeConfig.iconText}`} />;
      case 'Resumo': return <BookOpen className={`w-5 h-5 ${typeConfig.iconText}`} />;
      case 'Documento': return <FileText className={`w-5 h-5 ${typeConfig.iconText}`} />;
      case 'Risco': return <AlertTriangle className={`w-5 h-5 ${typeConfig.iconText}`} />;
      default: return <BookOpen className={`w-5 h-5 ${typeConfig.iconText}`} />;
    }
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(post.createdAt));

  return (
    <div className={`relative bg-white rounded-2xl border-l-4 ${posturaStyle.border} ${posturaStyle.bg} shadow flex flex-col h-full overflow-hidden transition-all hover:shadow-lg`}>
      
      {/* 1 & 3: Ícone do Tipo e Ações superiores */}
      <div className="p-5 pb-2 flex justify-between items-start">
        <div className={`p-1 rounded-lg ${typeConfig.iconBg}`}>
          {getIcon()}
        </div>
        
        <div className="flex gap-1 items-center">
          <button onClick={() => onView(post)} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors" title="Visualizar">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(post)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" title="Editar">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => { if(confirm('Deseja excluir?')) onDelete(post.id); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Excluir">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6: Tipografia e Títulos */}
      <div className="px-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-700 text-base mb-2 leading-tight tracking-tight">
          {post.title}
        </h3>
        <p className="text-slate-500 text-[13px] mb-6 leading-relaxed font-medium line-clamp-4">
          {post.content}
        </p>

        {/* 5: Badges estilo "Pills" */}
        <div className="flex gap-2 mb-6 flex-wrap mt-auto">
          <span className="px-3 py-1 bg-slate-100/80 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200/50">
            {post.postura}
          </span>
      </div>

      {/* 4: Rodapé de Metadados formatado */}
      <div className="px-5 py-3.5 border-t border-slate-100/50 bg-white/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold truncate max-w-[120px]">
            {post.author || 'Anônimo'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;