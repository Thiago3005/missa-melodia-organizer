
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Youtube, Plus, Download } from 'lucide-react';
import { SECOES_LITURGICAS, SecaoLiturgica } from '../../types';

interface ResultadoBusca {
  id: string;
  titulo: string;
  canal: string;
  thumbnail: string;
  duracao: string;
  url: string;
}

export function BuscarMusicas() {
  const [termoBusca, setTermoBusca] = useState('');
  const [secaoFiltro, setSecaoFiltro] = useState<SecaoLiturgica | 'todas'>('todas');
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [carregando, setCarregando] = useState(false);

  const sugestoesMusicais = [
    'Deus te salve Maria',
    'Vem Espírito Santo',
    'Pão de Vida',
    'Jesus Cristo',
    'Aleluia',
    'Santo',
    'Cordeiro de Deus',
    'Glória',
    'Magnificat',
    'Salmo 23'
  ];

  const handleBuscar = async () => {
    setCarregando(true);
    // Simular busca no YouTube (implementar com API real depois)
    setTimeout(() => {
      const resultadosSimulados: ResultadoBusca[] = [
        {
          id: '1',
          titulo: `${termoBusca} - Versão Católica`,
          canal: 'Ministério de Música',
          thumbnail: '/placeholder.svg',
          duracao: '3:45',
          url: `https://youtube.com/watch?v=exemplo1`
        },
        {
          id: '2',
          titulo: `${termoBusca} - Coral Paroquial`,
          canal: 'Música Litúrgica',
          thumbnail: '/placeholder.svg',
          duracao: '4:12',
          url: `https://youtube.com/watch?v=exemplo2`
        }
      ];
      setResultados(resultadosSimulados);
      setCarregando(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Buscar Músicas Litúrgicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite o nome da música ou tema..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="flex-1"
              />
              <Select value={secaoFiltro} onValueChange={(value) => setSecaoFiltro(value as SecaoLiturgica | 'todas')}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por seção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as seções</SelectItem>
                  {Object.entries(SECOES_LITURGICAS).map(([secao, label]) => (
                    <SelectItem key={secao} value={secao}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleBuscar} disabled={!termoBusca.trim() || carregando}>
                <Search className="h-4 w-4 mr-2" />
                {carregando ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Sugestões rápidas */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Sugestões populares:</p>
              <div className="flex flex-wrap gap-2">
                {sugestoesMusicais.map((sugestao) => (
                  <Badge
                    key={sugestao}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setTermoBusca(sugestao)}
                  >
                    {sugestao}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da busca */}
      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultados.map((resultado) => (
                <div key={resultado.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={resultado.thumbnail}
                    alt={resultado.titulo}
                    className="w-20 h-15 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{resultado.titulo}</h4>
                    <p className="text-sm text-gray-600">{resultado.canal}</p>
                    <p className="text-xs text-gray-500">{resultado.duracao}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={resultado.url} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4 mr-2" />
                        Ver
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar MP3
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {carregando && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Buscando músicas no YouTube...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
