import React, { useState, useEffect, useRef } from 'react';
import { Post, PosturaType, ContentType } from '../types';
import { POSTURAS, CONTENT_TYPES } from '../constants';
import { X, Upload, Save, Loader2, MapPin, User } from 'lucide-react';

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
  // Subprefeitura fixada em Penha
  const [type, setType] = useState<ContentType>('Resumo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [author, setAuthor] = useState('');
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPostura(initialData.postura);
        setType(initialData.type);
        setTitle(initialData.title);
        setContent(initialData.content);
        setAddress(initialData.address || '');
        setAuthor(initialData.author || '');
        setFileName(initialData.fileName);
      } else {
        const validPostura = defaultPostura === 'Todas' ? 'Obras' : defaultPostura;
        setPostura(validPostura as PosturaType);
        setType('Resumo');
        setTitle('');
        setContent('');
        setAddress('');
        setAuthor('');
        setFileName(undefined);
      }
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
    setIsSubmitting(true);
    
    const postData: any = { 
      id: initialData?.id,
      postura, 
      subprefeitura: 'penha', // Fixo
      type, 
      title, 
      content, 
      address: address || undefined, 
      author: author || undefined, 
      fileName: fileName || undefined,
      createdAt: initialData?.createdAt || Date.now()
    };

    try {
      await onSubmit(postData);
      onClose();
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]" onClick={handleBackdropClick}>
      <div ref={modalRef} className="bg-white rounded-3xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-slate-800">{initialData ? 'Editar Registro' : 'Novo Registro - Penha'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Postura</label>
              <select value={postura} onChange={(e) => setPostura(e.target.value as PosturaType)} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                {POSTURAS.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Tipo de Conteúdo</label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.filter(t => t.value !== 'Todas').map(ct => (
                <button key={ct.value} type="button" onClick={() => setType(ct.value as ContentType)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${type === ct.value ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Assunto / Título</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título breve do registro..." className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow font-medium" />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Descrição Detalhada</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Descreva os detalhes aqui..." className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium leading-relaxed"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Endereço (Opcional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, Número..." className="w-full p-3 pl-10 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Autor (Opcional)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Seu nome..." className="w-full p-3 pl-10 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Anexar Documento</label>
             <div className="relative group">
                <input type="file" id="modal-file" className="hidden" onChange={handleFileChange} />
                <label htmlFor="modal-file" className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer group-hover:bg-slate-100 group-hover:border-indigo-300 transition-all">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mb-2" />
                  <span className="text-xs font-medium text-slate-500 truncate max-w-full px-4">{fileName || 'Clique para selecionar arquivo'}</span>
                </label>
             </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3.5 text-slate-400 font-medium rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-indigo-600 text-white font-medium rounded-2xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : <><Save className="w-4 h-4" /> {initialData ? 'Salvar Alterações' : 'Publicar Agora'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;