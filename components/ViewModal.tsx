import React from 'react';
import { Post } from '../types';
import { POSTURA_COLORS, CONTENT_TYPES } from '../constants';
import { X, MapPin, User, Calendar, FileText } from 'lucide-react';

interface ViewModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ post, isOpen, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen || !post) return null;

  const typeConfig = CONTENT_TYPES.find(c => c.value === post.type) || CONTENT_TYPES[1];
  const posturaStyle = POSTURA_COLORS[post.postura] || POSTURA_COLORS['Todas'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px]" onClick={handleBackdropClick}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <div className={`p-8 border-b border-slate-50 flex justify-between items-start`}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${posturaStyle.bg} ${posturaStyle.text}`}>
                {post.postura}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500`}>
                {typeConfig.label}
              </span>
            </div>
            <h2 className={`text-2xl font-bold text-slate-900 leading-tight`}>{post.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="prose prose-slate max-w-none">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Informações do Relato</h4>
            <div className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {post.content}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {post.address && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Endereço</h4>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  {post.address}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadados</h4>
              <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                 <User className="w-4 h-4 text-slate-400" />
                 {post.author || 'Anônimo'}
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                 <Calendar className="w-4 h-4 text-slate-300" />
                 {new Date(post.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {post.fileName && (
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
              <FileText className="w-6 h-6 text-slate-400" />
              <div className="text-sm font-semibold text-slate-700">{post.fileName}</div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-3xl">
          <button onClick={onClose} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm shadow-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;