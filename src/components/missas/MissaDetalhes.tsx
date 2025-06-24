
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileText, Music, Youtube, Trash2 } from 'lucide-react';
import { Missa, Musica, SECOES_LITURGICAS, SecaoLiturgica } from '../../types';

interface MissaDetalhesProps {
  missa: Missa;
  onAddMusica: (missaId: string, musica: Omit<Musica, 'id' | 'missaId'>) => void;
  onRemoveMusica: (missaId: string, musicaId: string) => void;
  onBack: () => void;
}

export function MissaDetalhes({ missa, onAddMusica, onRemoveMusica, onBack }: MissaDetalhesProps) {
  const [novaMusica, setNovaMusica] = useState({
    nome: '',
    cantor: '',
    linkYoutube: '',
    partitura: '',
    linkDownload: '',
    observacoes: '',
    secaoLiturgica: 'entrada' as SecaoLiturgica
  });
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoLiturgica>('entrada');

  const getMusicasPorSecao = (secao: SecaoLiturgica) => {
    return missa.musicas.filter(musica => musica.secaoLiturgica === secao);
  };

  const handleAddMusica = () => {
    if (novaMusica.nome.trim()) {
      onAddMusica(missa.id, { ...novaMusica, secaoLiturgica: secaoAtiva });
      setNovaMusica({
        nome: '',
        cantor: '',
        linkYoutube: '',
        partitura: '',
        linkDownload: '',
        observacoes: '',
        secaoLiturgica: secaoAtiva
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Missa */}
      <div className="flex items-center justify-between">
        <div>
          <Button onClick={onBack} variant="outline" className="mb-4">
            ← Voltar
          </Button>
          <h2 className="text-2xl font-bold">{missa.tipo}</h2>
          <p className="text-gray-600">
            {new Date(missa.data).toLocaleDateString('pt-BR')} - {missa.horario}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Baixar ZIP
          </Button>
        </div>
      </div>

      {/* Navegação das Seções Litúrgicas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {Object.entries(SECOES_LITURGICAS).map(([secao, label]) => {
          const musicasCount = getMusicasPorSecao(secao as SecaoLiturgica).length;
          return (
            <Button
              key={secao}
              variant={secaoAtiva === secao ? "default" : "outline"}
              onClick={() => setSecaoAtiva(secao as SecaoLiturgica)}
              className="text-xs p-2 h-auto flex flex-col items-center"
            >
              <span className="text-center">{label}</span>
              {musicasCount > 0 && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {musicasCount}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Seção Ativa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {SECOES_LITURGICAS[secaoAtiva]}
            <span className="text-sm font-normal text-gray-500">
              {getMusicasPorSecao(secaoAtiva).length} música(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formulário para adicionar música */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Input
                placeholder="Nome da música"
                value={novaMusica.nome}
                onChange={(e) => setNovaMusica({ ...novaMusica, nome: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Cantor/Intérprete"
                value={novaMusica.cantor}
                onChange={(e) => setNovaMusica({ ...novaMusica, cantor: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Link do YouTube"
                value={novaMusica.linkYoutube}
                onChange={(e) => setNovaMusica({ ...novaMusica, linkYoutube: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Link da Partitura"
                value={novaMusica.partitura}
                onChange={(e) => setNovaMusica({ ...novaMusica, partitura: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Observações"
                value={novaMusica.observacoes}
                onChange={(e) => setNovaMusica({ ...novaMusica, observacoes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleAddMusica} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Música
              </Button>
            </div>
          </div>

          {/* Lista de músicas da seção */}
          <div className="space-y-3">
            {getMusicasPorSecao(secaoAtiva).map((musica) => (
              <div key={musica.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{musica.nome}</h4>
                    {musica.cantor && (
                      <p className="text-sm text-gray-600">por {musica.cantor}</p>
                    )}
                    {musica.observacoes && (
                      <p className="text-sm text-gray-500 italic mt-1">{musica.observacoes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {musica.linkYoutube && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={musica.linkYoutube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {musica.partitura && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={musica.partitura} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Music className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onRemoveMusica(missa.id, musica.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {getMusicasPorSecao(secaoAtiva).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Music className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Nenhuma música cadastrada para esta seção</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
