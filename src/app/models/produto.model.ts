export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  marca?: string;
  tamanho?: string;
  cor?: string;
  estoque?: number;
  dataCriacao?: string;
}