import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DadosDialogoConfirmacao {
  titulo: string;
  mensagem: string;
  textoBotaoConfirmar?: string;
  textoBotaoCancelar?: string;
  icone?: string;
  corBotaoConfirmar?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-dialogo-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="titulo-dialogo">
      @if (dados.icone) {
        <mat-icon class="icone-dialogo" [color]="dados.corBotaoConfirmar || 'warn'">
          {{ dados.icone }}
        </mat-icon>
      }
      {{ dados.titulo }}
    </h2>

    <mat-dialog-content class="conteudo-dialogo">
      <p>{{ dados.mensagem }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="acoes-dialogo">
      <button mat-button (click)="onCancelar()">
        {{ dados.textoBotaoCancelar || 'Cancelar' }}
      </button>
      <button 
        mat-raised-button 
        [color]="dados.corBotaoConfirmar || 'warn'" 
        (click)="onConfirmar()">
        {{ dados.textoBotaoConfirmar || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .titulo-dialogo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 24px 24px 16px;
    }

    .icone-dialogo {
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .conteudo-dialogo {
      padding: 0 24px;
      color: #666;

      p {
        margin: 0;
        line-height: 1.5;
      }
    }

    .acoes-dialogo {
      padding: 16px 24px 24px;
      border-top: 1px solid #e0e0e0;
      margin-top: 8px;
    }
  `]
})
export class DialogoConfirmacaoComponent {
  readonly referenciaDialogo = inject(MatDialogRef<DialogoConfirmacaoComponent>);
  readonly dados = inject<DadosDialogoConfirmacao>(MAT_DIALOG_DATA);

  onConfirmar(): void {
    this.referenciaDialogo.close(true);
  }

  onCancelar(): void {
    this.referenciaDialogo.close(false);
  }
}