export type PosturaType = 
  | 'Todas'
  | 'Obras' 
  | 'MPL' 
  | 'Atividades' 
  | 'Ambulantes' 
  | 'Publicidade' 
  | 'Área Pública' 
  | 'POP'
  | 'Defesa Civil'
  | 'Outras';

export type ContentType = 'Dica' | 'Resumo' | 'Risco' | 'Documento';

export interface Post {
  id: string;
  postura: PosturaType;
  subprefeitura: string; // ID of the subprefeitura
  title: string;
  content: string;
  address?: string;
  author?: string;
  type: ContentType;
  createdAt: number;
  fileName?: string; // Simulated file attachment name
}

export interface Subprefeitura {
  id: string;
  name: string;
  region: 'Centro' | 'Norte' | 'Sul' | 'Leste' | 'Oeste';
}