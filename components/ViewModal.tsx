import React from 'react';
import { Post } from '../types';
import { POSTURA_COLORS, CONTENT_TYPES } from '../constants';
import { X, MapPin, User, Calendar, Tag, Info, Share2, Clock } from 'lucide-react';

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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-5xl max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row relative">
        
        {/* Botão de Fechar Flutuante (Mobile) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm hover:bg-slate-100 rounded-full transition-all text-slate-500 md:hidden border border-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Lado Esquerdo: Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${posturaStyle.bg} ${posturaStyle.text} border border-current opacity-90`}>
                  {post.postura}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200`}>
                  {typeConfig.label}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight overflow-wrap-anywhere">
                {post.title}
              </h2>

              <div className="flex items-center gap-6 text-slate-400 text-sm font-medium border-y border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author || 'Anônimo'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </header>

            <article className="prose prose-slate prose-lg max-w-none">
              <div 
                className="text-slate-700 text-xl leading-relaxed font-normal rich-text-content-v2"
                lang="pt-BR"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {post.address && (
              <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-slate-100/50">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <MapPin className="w-6 h-6" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Localização do Evento</h4>
                </div>
                <p className="text-slate-800 text-lg font-semibold leading-snug overflow-wrap-anywhere">
                  {post.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Barra Lateral de Info (Desktop) */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-50 border-l border-slate-100 flex flex-col shrink-0">
          <div className="hidden md:flex p-6 justify-end">
            <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 md:p-10 space-y-12 flex-1 overflow-y-auto">
            <section>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Classificação
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                  <span className="text-slate-500 text-sm font-medium">Postura</span>
                  <span className={`font-bold text-sm ${posturaStyle.text}`}>{post.postura}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                  <span className="text-slate-500 text-sm font-medium">Tipo</span>
                  <span className="text-slate-800 font-bold text-sm">{typeConfig.label}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Detalhes do Registro
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Horário</p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(post.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Relator</p>
                    <p className="text-sm font-bold text-slate-800">{post.author || 'Anônimo'}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-8">
               <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95">
                 <Share2 className="w-4 h-4" />
                 COMPARTILHAR
               </button>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-100 mt-auto hidden md:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Fiscais SP • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .overflow-wrap-anywhere {
          overflow-wrap: break-word;
          word-break: normal;
        }
        .rich-text-content-v2 {
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
};

export default ViewModal;