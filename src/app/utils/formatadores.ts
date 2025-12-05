export class Formatadores {
  static formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  static formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  static obterCorHex(cor: string | undefined): string {
    const mapaCores: Record<string, string> = {
      'Preto': '#000000',
      'Branco': '#FFFFFF',
      'Marrom': '#8B4513',
      'Azul': '#0000FF',
      'Vermelho': '#FF0000',
      'Verde': '#008000',
      'Cinza': '#808080',
      'Bege': '#F5F5DC',
      'Preto/Branco': '#000000',
      'Azul Marinho': '#000080',
      'Verde Oliva': '#808000'
    };
    return mapaCores[cor || ''] || '#CCCCCC';
  }
}