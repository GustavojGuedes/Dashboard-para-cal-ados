import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { FormularioProdutoComponent } from '../formulario-produto/formulario-produto.component';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss']
})
export class ListaProdutosComponent implements OnInit {
  colunas: string[] = ['id', 'nome', 'categoria', 'marca', 'preco', 'estoque', 'tamanho', 'cor', 'acoes'];
  dados = new MatTableDataSource<Produto>();
  
  categorias: string[] = [];
  carregando = false;
  
  busca = '';
  categoriaSelecionada = '';
  itensPorPagina = 10;
  paginaAtual = 0;
  totalItens = 0;

  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenador!: MatSort;

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarCategorias();
  }

  ngAfterViewInit(): void {
    this.dados.paginator = this.paginador;
    this.dados.sort = this.ordenador;
  }

  carregarProdutos(): void {
    this.carregando = true;
    
    this.produtoService.getProdutos(
      this.paginaAtual + 1,
      this.itensPorPagina,
      this.busca,
      this.categoriaSelecionada
    ).subscribe({
      next: (produtos) => {
        this.dados.data = produtos;
        this.totalItens = produtos.length * 3; // Aproximação para paginação
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao carregar produtos', 'erro');
        this.carregando = false;
      }
    });
  }

  carregarCategorias(): void {
    this.produtoService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaAtual = 0;
    this.carregarProdutos();
  }

  limparFiltros(): void {
    this.busca = '';
    this.categoriaSelecionada = '';
    this.paginaAtual = 0;
    this.carregarProdutos();
  }

  mudarPagina(evento: PageEvent): void {
    this.paginaAtual = evento.pageIndex;
    this.itensPorPagina = evento.pageSize;
    this.carregarProdutos();
  }

  novoProduto(): void {
    this.abrirFormulario();
  }

  abrirFormulario(produto?: Produto): void {
    const dialogRef = this.dialog.open(FormularioProdutoComponent, {
      width: '600px',
      data: produto
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.carregarProdutos();
        const mensagem = produto ? 'Produto atualizado!' : 'Produto criado!';
        this.mostrarMensagem(mensagem, 'sucesso');
      }
    });
  }

  editarProduto(produto: Produto): void {
    this.abrirFormulario(produto);
  }

  excluirProduto(produto: Produto): void {
    const dialogRef = this.dialog.open(DialogoConfirmacaoComponent, {
      width: '400px',
      data: {
        titulo: 'Excluir Produto',
        mensagem: `Deseja excluir "${produto.nome}"?`,
        textoConfirmar: 'Excluir',
        textoCancelar: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado && produto.id) {
        this.produtoService.deleteProduto(produto.id).subscribe({
          next: () => {
            this.carregarProdutos();
            this.mostrarMensagem('Produto excluído!', 'sucesso');
          },
          error: () => {
            this.mostrarMensagem('Erro ao excluir produto', 'erro');
          }
        });
      }
    });
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  getCorHex(cor: string | undefined): string {
    const cores: Record<string, string> = {
      'Preto': '#000000',
      'Branco': '#FFFFFF',
      'Marrom': '#8B4513',
      'Azul': '#0000FF',
      'Vermelho': '#FF0000',
      'Verde': '#008000',
      'Cinza': '#808080',
      'Bege': '#F5F5DC'
    };
    return cores[cor || ''] || '#CCCCCC';
  }

  private mostrarMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.snackBar.open(texto, 'Fechar', {
      duration: 3000,
      panelClass: tipo === 'sucesso' ? 'snackbar-sucesso' : 'snackbar-erro'
    });
  }
}