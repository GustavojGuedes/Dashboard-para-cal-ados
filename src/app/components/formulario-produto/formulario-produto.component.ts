import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-formulario-produto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule
  ],
  templateUrl: './formulario-produto.component.html',
  styleUrls: ['./formulario-produto.component.scss']
})
export class FormularioProdutoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  
  readonly referenciaDialogo = inject(MatDialogRef<FormularioProdutoComponent>);
  readonly dados = inject<Produto | undefined>(MAT_DIALOG_DATA);

  formularioProduto: FormGroup;
  modoEdicao = false;
  enviando = false;

  // Opções para os selects
  categorias = ['Esportivo', 'Social', 'Casual', 'Botas', 'Sandálias', 'Sapatilhas'];
  tamanhos = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  cores = ['Preto', 'Branco', 'Marrom', 'Azul', 'Vermelho', 'Verde', 'Cinza', 'Bege', 'Preto/Branco', 'Azul Marinho', 'Verde Oliva'];
  marcas = ['Nike', 'Adidas', 'Puma', 'Mizuno', 'Olympikus', 'Asics', 'Havaianas', 'Arezzo', 'Via Marte', 'Converse', 'Vans', 'Reserva'];

  constructor() {
    this.formularioProduto = this.criarFormulario();
  }

  ngOnInit(): void {
    if (this.dados) {
      this.modoEdicao = true;
      this.preencherFormulario();
    }
  }

  criarFormulario(): FormGroup {
    return this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      descricao: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      preco: [null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999.99)
      ]],
      categoria: ['', Validators.required],
      marca: [''],
      tamanho: [''],
      cor: [''],
      estoque: [0, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999)
      ]]
    });
  }

  preencherFormulario(): void {
    this.formularioProduto.patchValue(this.dados!);
  }

  onSubmit(): void {
    if (this.formularioProduto.invalid) {
      this.marcarControlesComoTocados();
      return;
    }

    this.enviando = true;
    const produto = this.formularioProduto.value;

    const operacao = this.modoEdicao
      ? this.produtoService.atualizarProduto(this.dados!.id!, produto)
      : this.produtoService.criarProduto(produto);

    operacao
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.referenciaDialogo.close(true);
          this.enviando = false;
        },
        error: (erro) => {
          this.mostrarErro('Erro ao salvar produto');
          this.enviando = false;
        }
      });
  }

  onCancelar(): void {
    this.referenciaDialogo.close(false);
  }

  private marcarControlesComoTocados(): void {
    Object.keys(this.formularioProduto.controls).forEach(chave => {
      const controle = this.formularioProduto.get(chave);
      controle?.markAsTouched();
    });
  }

  private mostrarErro(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      panelClass: ['snackbar-erro']
    });
  }

  // Getters para facilitar o acesso no template
  get controles() {
    return this.formularioProduto.controls;
  }

  get tituloDialogo(): string {
    return this.modoEdicao ? 'Editar Produto' : 'Novo Produto';
  }
}