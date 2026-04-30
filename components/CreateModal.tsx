import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Post, PosturaType, ContentType } from '../types';
import { POSTURAS, CONTENT_TYPES } from '../constants';
import { X, Save, Loader2, MapPin, User } from 'lucide-react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]" onClick={handleBackdropClick}>
      <div ref={modalRef} className="bg-white rounded-none shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-slate-800">{initialData ? 'Editar Registro' : 'Novo Registro - Penha'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-none transition-colors text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Postura</label>
              <select value={postura} onChange={(e) => setPostura(e.target.value as PosturaType)} className="w-full p-3 bg-slate-50 border-none rounded-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                {POSTURAS.filter(p => p !== 'Todas').map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Tipo de Conteúdo</label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.filter(t => t.value !== 'Todas').map(ct => (
                <button key={ct.value} type="button" onClick={() => setType(ct.value as ContentType)} className={`px-4 py-2 rounded-none text-xs font-medium transition-all ${type === ct.value ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Assunto / Título</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título breve do registro..." className="w-full p-3 bg-slate-50 border-none rounded-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow font-medium" />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Descrição Detalhada</label>
            <div className="bg-slate-50 rounded-none overflow-hidden min-h-[300px] border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                placeholder="Descreva os detalhes aqui..."
                className="h-[250px] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Endereço (Opcional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, Número..." className="w-full p-3 pl-10 bg-slate-50 border-none rounded-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 text-indigo-600">Autor (Obrigatório)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Seu nome..." className="w-full p-3 pl-10 bg-slate-50 border-none rounded-none text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-xs font-semibold px-2">
              {errorMessage}
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3.5 text-slate-400 font-medium rounded-none hover:bg-slate-50 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-indigo-600 text-white font-medium rounded-none hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Processando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> 
                  {initialData ? 'Salvar Alterações' : 'Publicar Agora'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;