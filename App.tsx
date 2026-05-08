import React, { useState, useEffect, useMemo } from 'react';
import { POSTURAS, POSTURA_COLORS, CONTENT_TYPES } from './constants';
import { Post, PosturaType } from './types';
import PostCard from './components/PostCard';
import CreateModal from './components/CreateModal';
import ViewModal from './components/ViewModal';
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from './firebase';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  Building,
  ClipboardCheck,
  Package,
  Megaphone,
  Trees,
  UserCheck,
  ShieldAlert,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostura, setSelectedPostura] = useState<PosturaType>('Todas');
  const [selectedType, setSelectedType] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // Hardcoded ID para Penha
  const CURRENT_SUB_ID = 'penha';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        
        const penhaPosts = fetchedPosts.filter(p => p.subprefeitura === CURRENT_SUB_ID);
        setPosts(penhaPosts);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSavePost = async (postData: any) => {
    try {
      postData.subprefeitura = CURRENT_SUB_ID;
      const sanitizedData = Object.keys(postData).reduce((acc: any, key) => {
        if (postData[key] !== undefined) acc[key] = postData[key];
        return acc;
      }, {});

      if (sanitizedData.id) {
        const postRef = doc(db, "posts", sanitizedData.id);
        const { id, ...dataToUpdate } = sanitizedData;
        await updateDoc(postRef, dataToUpdate);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...dataToUpdate } : p));
      } else {
        const newDoc = { ...sanitizedData, createdAt: Date.now() };
        const docRef = await addDoc(collection(db, "posts"), newDoc);
        setPosts(prev => [{ ...newDoc, id: docRef.id }, ...prev]);
      }
      return Promise.resolve();
    } catch (e) {
      console.error("Firebase save error: ", e);
      return Promise.reject(e);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("Error deleting: ", e);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleViewClick = (post: Post) => {
    setViewingPost(post);
    setIsViewModalOpen(true);
  };

  const stats = useMemo(() => {
    const total = posts.length;
    const uniqueAuthors = new Set(posts.map(p => p.author).filter(Boolean)).size;
    const activeThemes = new Set(posts.map(p => p.postura)).size;
    const riskCount = posts.filter(p => p.type === 'Risco').length;
    return { total, uniqueAuthors, activeThemes, riskCount };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchPostura = selectedPostura === 'Todas' || post.postura === selectedPostura;
      const matchType = selectedType === 'Todas' || post.type === selectedType;
      const matchSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.address && post.address.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchPostura && matchType && matchSearch;
    });
  }, [posts, selectedPostura, selectedType, searchTerm]);

  const getPosturaIcon = (name: string) => {
    switch (name) {
      case 'Todas': return <LayoutGrid className="w-4 h-4" />;
      case 'Obras': return <Building className="w-4 h-4" />;
      case 'MPL': return <ClipboardCheck className="w-4 h-4" />;
      case 'Atividades': return <Package className="w-4 h-4" />;
      case 'Ambulantes': return <Users className="w-4 h-4" />;
      case 'Publicidade': return <Megaphone className="w-4 h-4" />;
      case 'Área Pública': return <Trees className="w-4 h-4" />;
      case 'POP': return <UserCheck className="w-4 h-4" />;
      case 'Defesa Civil': return <ShieldAlert className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans text-slate-900 pb-20">
      
      {/* Header Premium */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Subprefeitura Penha
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg border border-indigo-100">Portal Interno</span>
                </h1>
                <p className="text-sm text-slate-500 font-bold opacity-70 tracking-wide uppercase text-[10px]">Base de Inteligência Colaborativa</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por título, conteúdo ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm transition-all outline-none font-semibold text-slate-700"
                />
              </div>
              <button 
                onClick={() => { setEditingPost(null); setIsCreateModalOpen(true); }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 font-bold text-sm"
              >
                <Plus className="w-5 h-5" />
                NOVO REGISTRO
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 pt-10">
        
        {/* Dashboard Minimalista */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><FileText className="w-5 h-5" /></div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Relatos</div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl"><Users className="w-5 h-5" /></div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Autores</div>
              <div className="text-3xl font-bold text-slate-900">{stats.uniqueAuthors}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl"><Trees className="w-5 h-5" /></div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Temas</div>
              <div className="text-3xl font-bold text-slate-900">{stats.activeThemes}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Riscos</div>
              <div className="text-3xl font-bold text-slate-900 text-rose-600">{stats.riskCount}</div>
            </div>
        </div>

        {/* Filtros Modernos */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              FILTRAR REGISTROS
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Mostrando {filteredPosts.length} resultados
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {POSTURAS.map(postura => {
                const isActive = selectedPostura === postura;
                const colors = POSTURA_COLORS[postura];
                return (
                  <button
                    key={postura}
                    onClick={() => setSelectedPostura(postura)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isActive ? `${colors.active} border-transparent shadow-lg shadow-indigo-100 scale-105 z-10` : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : colors.iconColor}>
                      {getPosturaIcon(postura)}
                    </span>
                    {postura.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50 pt-6">
              {CONTENT_TYPES.map(type => {
                const isActive = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border uppercase tracking-widest ${
                      isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content List (Horizontal Cards) */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
              <LayoutGrid className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Sincronizando Base da Penha...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border-2 border-slate-100 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Filter className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum registro encontrado</h3>
            <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-wide">Tente ajustar seus filtros ou busca</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-32">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} onEdit={handleEditClick} onView={handleViewClick} />
            ))}
          </div>
        )}
      </main>

      <CreateModal 
        isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setEditingPost(null); }}
        onSubmit={handleSavePost} defaultSubprefeitura={CURRENT_SUB_ID} defaultPostura={selectedPostura} initialData={editingPost}
      />
      <ViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} post={viewingPost} />
    </div>
  );
}