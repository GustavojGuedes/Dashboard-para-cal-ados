import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';
  
  // Dados mock para testes
  private produtosMock: Produto[] = [
    {
      id: 1,
      nome: 'Tênis Nike Air Max',
      descricao: 'Tênis esportivo com amortecimento Air Max',
      preco: 499.90,
      categoria: 'Esportivo',
      marca: 'Nike',
      tamanho: '42',
      cor: 'Preto/Branco',
      estoque: 50,
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      nome: 'Sapato Social Derby',
      descricao: 'Sapato social em couro legítimo',
      preco: 299.90,
      categoria: 'Social',
      marca: 'Via Marte',
      tamanho: '41',
      cor: 'Marrom',
      estoque: 25,
      dataCriacao: '2024-01-10'
    },
    {
      id: 3,
      nome: 'Chinelo Havaianas Slim',
      descricao: 'Chinelo confortável para o dia a dia',
      preco: 39.90,
      categoria: 'Casual',
      marca: 'Havaianas',
      tamanho: '43',
      cor: 'Azul',
      estoque: 100,
      dataCriacao: '2024-01-05'
    }
  ];

  constructor(private http: HttpClient) {}

  getProdutos(
    pagina: number = 1,
    limite: number = 10,
    busca: string = '',
    categoria: string = ''
  ): Observable<Produto[]> {
    // Se não tiver backend, usar mock
    let produtos = [...this.produtosMock];
    
    // Aplicar filtros
    if (busca) {
      const buscaLower = busca.toLowerCase();
      produtos = produtos.filter(p => 
        p.nome.toLowerCase().includes(buscaLower) ||
        p.descricao.toLowerCase().includes(buscaLower) ||
        (p.marca && p.marca.toLowerCase().includes(buscaLower))
      );
    }
    
    if (categoria) {
      produtos = produtos.filter(p => p.categoria === categoria);
    }
    
    // Simular paginação
    const inicio = (pagina - 1) * limite;
    const fim = inicio + limite;
    const resultado = produtos.slice(inicio, fim);
    
    return of(resultado).pipe(delay(500));
  }

  getProduto(id: number): Observable<Produto> {
    const produto = this.produtosMock.find(p => p.id === id);
    return of(produto!).pipe(delay(300));
  }

  createProduto(produto: Produto): Observable<Produto> {
    const novoProduto = {
      ...produto,
      id: this.produtosMock.length + 1,
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    this.produtosMock.push(novoProduto);
    return of(novoProduto).pipe(delay(500));
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    const index = this.produtosMock.findIndex(p => p.id === id);
    if (index !== -1) {
      this.produtosMock[index] = { ...produto, id };
    }
    return of(this.produtosMock[index]).pipe(delay(500));
  }

  deleteProduto(id: number): Observable<void> {
    this.produtosMock = this.produtosMock.filter(p => p.id !== id);
    return of(void 0).pipe(delay(500));
  }

  getCategorias(): Observable<string[]> {
    const categorias = [...new Set(this.produtosMock.map(p => p.categoria))];
    return of(categorias).pipe(delay(300));
  }
}