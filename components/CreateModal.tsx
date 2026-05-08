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
      <div ref={modalRef} className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{initialData ? 'Editar Registro' : 'Novo Registro'}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Unidade: Subprefeitura Penha</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tema da Fiscalização</label>
              <div className="relative">
                <select 
                  value={postura} 
                  onChange={(e) => setPostura(e.target.value as PosturaType)} 
                  className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  {POSTURAS.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-indigo-600">Autor (Obrigatório)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="Seu nome..." 
                  className="w-full p-3 pl-10 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Classificação do Conteúdo</label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.filter(t => t.value !== 'Todas').map(ct => (
                <button 
                  key={ct.value} 
                  type="button" 
                  onClick={() => setType(ct.value as ContentType)} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest border ${type === ct.value ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assunto Principal</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Irregularidade na Av. Penha de França..." 
              className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" 
            />
          </div>

          <div className="flex-1 flex flex-col min-h-[400px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição Detalhada</label>
            <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 focus-within:border-indigo-500 transition-all flex flex-col">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                placeholder="Descreva aqui todas as observações pertinentes..."
                className="flex-1 font-medium text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localização (Opcional)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Logradouro, número..." 
                className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300" 
              />
            </div>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="px-6 py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            CANCELAR
          </button>
          <button 
            onClick={(e) => handleSubmit(e as any)}
            disabled={isSubmitting} 
            className="flex-1 py-3 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> 
                SALVANDO...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> 
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
          padding: 8px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ql-editor {
          padding: 15px !important;
          flex: 1;
        }
      `}} />
    </div>
  );
};

export default CreateModal;