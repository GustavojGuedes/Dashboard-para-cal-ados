import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListaProdutosComponent } from './components/lista-produtos/lista-produtos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ListaProdutosComponent
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <mat-icon class="toolbar-icon">shoe_formal</mat-icon>
      <span class="toolbar-title">Dashboard de Calçados</span>
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon>notifications</mat-icon>
      </button>
    </mat-toolbar>

    <main class="main-content">
      <app-lista-produtos></app-lista-produtos>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .toolbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .toolbar-icon {
      margin-right: 12px;
    }
    
    .toolbar-title {
      font-size: 1.2rem;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .main-content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Dashboard de Calçados';
}