import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Post, PosturaType, ContentType } from '../types';
import { POSTURAS, CONTENT_TYPES } from '../constants';
import { X, Save, Loader2, MapPin, User, ChevronDown } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => Promise<void>;
  defaultSubprefeitura: string;
  defaultPostura: string;
  initialData?: Post | null;
}

const CreateModal: React.FC<CreateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultPostura,
  initialData
}) => {
  const [postura, setPostura] = useState<PosturaType>('Obras');
  const [type, setType] = useState<ContentType>('Resumo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPostura(initialData.postura);
        setType(initialData.type);
        setTitle(initialData.title);
        setContent(initialData.content);
        setAddress(initialData.address || '');
        setAuthor(initialData.author || '');
      } else {
        const validPostura = defaultPostura === 'Todas' ? 'Obras' : defaultPostura;
        setPostura(validPostura as PosturaType);
        setType('Resumo');
        setTitle('');
        setContent('');
        setAddress('');
        setAuthor('');
      }
      setErrorMessage('');
    }
    setIsSubmitting(false);
  }, [isOpen, initialData, defaultPostura]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!author.trim()) {
      setErrorMessage('O campo Autor é obrigatório.');
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      setErrorMessage('O campo Descrição Detalhada é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const postData: any = { 
        id: initialData?.id,
        postura, 
        subprefeitura: 'penha', 
        type, 
        title, 
        content, 
        address: address || undefined, 
        author: author, 
        createdAt: initialData?.createdAt || Date.now()
      };

      await onSubmit(postData);
      onClose();
    } catch (error) {
      console.error("Failed to submit form:", error);
      setErrorMessage('Erro ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300" onClick={handleBackdropClick}>
      <div ref={modalRef} className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Editar Registro' : 'Novo Registro'}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Unidade: Subprefeitura Penha</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"><X className="w-6 h-6" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Tema da Fiscalização</label>
              <div className="relative">
                <select 
                  value={postura} 
                  onChange={(e) => setPostura(e.target.value as PosturaType)} 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  {POSTURAS.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Relator (Responsável)</label>
              <div className="relative">
                <User className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="Seu nome..." 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Classificação do Conteúdo</label>
            <div className="flex flex-wrap gap-3">
              {CONTENT_TYPES.filter(t => t.value !== 'Todas').map(ct => (
                <button 
                  key={ct.value} 
                  type="button" 
                  onClick={() => setType(ct.value as ContentType)} 
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest border-2 ${type === ct.value ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Assunto Principal</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Irregularidade na Av. Penha de França..." 
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-lg font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Descrição Detalhada</label>
            <div className="bg-slate-50 rounded-3xl overflow-hidden min-h-[350px] border-2 border-transparent focus-within:border-indigo-500 transition-all">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                placeholder="Descreva aqui todas as observações pertinentes..."
                className="h-[280px] font-semibold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 text-indigo-600">Localização do Evento (Opcional)</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-5 w-5 h-5 text-indigo-400" />
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Logradouro, número, ponto de referência..." 
                className="w-full p-5 pl-14 bg-indigo-50/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-indigo-200" 
              />
            </div>
          </div>
        </form>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            DESCARTAR
          </button>
          <button 
            onClick={(e) => handleSubmit(e as any)}
            disabled={isSubmitting} 
            className="flex-1 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-70 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> 
                PROCESSANDO...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> 
                {initialData ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR REGISTRO'}
              </>
            )}
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
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
        .ql-toolbar.ql-snow {
          border: none !important;
          background: #f1f5f9;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor {
          padding: 20px !important;
        }
      `}} />
    </div>
  );
};

export default CreateModal;