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
  MoreHorizontal
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
        
        // Filtra apenas posts da Penha caso o banco tenha dados misturados
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
      // Força a subprefeitura Penha
      postData.subprefeitura = CURRENT_SUB_ID;

      const sanitizedData = Object.keys(postData).reduce((acc: any, key) => {
        if (postData[key] !== undefined) {
          acc[key] = postData[key];
        }
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
      alert("Erro ao salvar no Firebase. Verifique sua conexão.");
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
    // Autores únicos como métrica interessante já que só temos 1 sub
    const uniqueAuthors = new Set(posts.map(p => p.author).filter(Boolean)).size;
    const activeThemes = new Set(posts.map(p => p.postura)).size;
    const riskCount = posts.filter(p => p.type === 'Risco').length;
    
    return { total, uniqueAuthors, activeThemes, riskCount };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchPostura = selectedPostura === 'Todas' || post.postura === selectedPostura;
      const matchType = selectedType === 'Todas' || post.type === selectedType;
      // Filtro de Sub removido pois já filtramos no fetch
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      
      {/* Topo Unificado - Sem Sidebar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  Subprefeitura Penha
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Base de Conhecimento e Fiscalização</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar registros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm transition-all outline-none font-medium"
                />
              </div>
              <button 
                onClick={() => { setEditingPost(null); setIsCreateModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 font-medium text-sm whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Novo Registro</span>
                <span className="md:hidden">Novo</span>
              </button>
            </div>
          </div>

          {/* Filtros embutidos no Header */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full justify-start md:justify-center pb-2">
              {POSTURAS.map(postura => {
                const isActive = selectedPostura === postura;
                const colors = POSTURA_COLORS[postura];
                return (
                  <button
                    key={postura}
                    onClick={() => setSelectedPostura(postura)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all flex items-center gap-2 border shadow-sm ${
                      isActive ? `${colors.active} border-transparent` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : colors.iconColor}>
                      {getPosturaIcon(postura)}
                    </span>
                    {postura}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full justify-start md:justify-center border-t border-slate-100 pt-3">
              {CONTENT_TYPES.map(type => {
                const isActive = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contribuições</div>
                <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><FileText className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Colaboradores</div>
                <div className="text-2xl font-bold text-slate-800">{stats.uniqueAuthors}</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Users className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Temas Ativos</div>
                <div className="text-2xl font-bold text-slate-800">{stats.activeThemes}</div>
              </div>
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alertas</div>
                <div className="text-2xl font-bold text-slate-800">{stats.riskCount}</div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
            </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-sm font-medium text-slate-400">Carregando dados da Penha...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <Filter className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Nenhum registro encontrado</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Seja o primeiro a colaborar com a equipe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
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