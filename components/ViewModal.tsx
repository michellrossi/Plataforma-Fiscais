import React from 'react';
import { Post } from '../types';
import { POSTURA_COLORS, CONTENT_TYPES } from '../constants';
import { X, MapPin, User, Calendar, Tag, Clock, Maximize2, Share2, Printer } from 'lucide-react';

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-slate-900/80 backdrop-blur-xl transition-all duration-500"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] w-full max-w-[96vw] h-[94vh] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col relative">
        
        {/* Barra de Ações Superior Estilo Browser */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 mr-4">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Maximize2 className="w-3 h-3" /> Visualização Expandida
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200">
              <Share2 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header de Título - Bem Largo */}
          <div className="pt-16 pb-10 px-8 md:px-24 lg:px-48 border-b border-slate-50">
             <div className="flex items-center gap-3 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] ${posturaStyle.bg} ${posturaStyle.text} border border-current`}>
                  {post.postura}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-500 border border-slate-200`}>
                  {typeConfig.label}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-10 overflow-wrap-break-word">
                {post.title}
              </h2>

              {/* Mini Barra de Info (Compacta) */}
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relator</p>
                    <p className="text-sm font-bold text-slate-800">{post.author || 'Anônimo'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data do Registro</p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {post.address && (
                  <div className="flex items-center gap-3 lg:ml-auto">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</p>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-[400px]">
                        {post.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* ÁREA DO TEXTO - Ocupando o máximo de espaço */}
          <div className="flex-1 px-8 md:px-24 lg:px-48 py-16">
            <article className="prose prose-slate prose-2xl max-w-none">
              <div 
                className="text-slate-800 text-2xl md:text-3xl leading-[1.6] font-normal rich-text-content-v3"
                lang="pt-BR"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </div>

        {/* Rodapé Slim */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
           <span>Fiscais SP • Inteligência de Campo</span>
           <div className="flex items-center gap-4">
             <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Última atualização: {new Date().toLocaleDateString()}</span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .rich-text-content-v3 {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: normal;
          hyphens: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @media (max-width: 768px) {
          .prose-2xl { font-size: 1.25rem; }
        }
      `}} />
    </div>
  );
};

export default ViewModal;