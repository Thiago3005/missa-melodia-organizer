
import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { MissaCard } from '../components/missas/MissaCard';
import { MissaForm } from '../components/missas/MissaForm';
import { MissaDetalhes } from '../components/missas/MissaDetalhes';
import { MusicoCard } from '../components/musicos/MusicoCard';
import { MusicoForm } from '../components/musicos/MusicoForm';
import { BuscarMusicas } from '../components/buscar/BuscarMusicas';
import { HistoricoMissas } from '../components/historico/HistoricoMissas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Calendar, Users, Music, TrendingUp } from 'lucide-react';
import { useMissas } from '../hooks/useMissas';
import { useMusicos } from '../hooks/useMusicos';
import { Missa, Musico } from '../types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('missas');
  const [showMissaForm, setShowMissaForm] = useState(false);
  const [showMusicoForm, setShowMusicoForm] = useState(false);
  const [editingMissa, setEditingMissa] = useState<Missa | null>(null);
  const [editingMusico, setEditingMusico] = useState<Musico | null>(null);
  const [selectedMissa, setSelectedMissa] = useState<Missa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    missas,
    adicionarMissa,
    atualizarMissa,
    removerMissa,
    adicionarMusicaNaMissa,
    removerMusicaDaMissa
  } = useMissas();

  const {
    musicos,
    adicionarMusico,
    atualizarMusico,
    removerMusico,
    adicionarAnotacao,
    removerAnotacao,
    adicionarSugestao,
    atualizarStatusSugestao
  } = useMusicos();

  const handleSaveMissa = (missaData: Omit<Missa, 'id'>) => {
    if (editingMissa) {
      atualizarMissa(editingMissa.id, missaData);
    } else {
      adicionarMissa(missaData);
    }
    setShowMissaForm(false);
    setEditingMissa(null);
  };

  const handleSaveMusico = (musicoData: Omit<Musico, 'id' | 'anotacoes' | 'sugestoes'>) => {
    if (editingMusico) {
      atualizarMusico(editingMusico.id, musicoData);
    } else {
      adicionarMusico(musicoData);
    }
    setShowMusicoForm(false);
    setEditingMusico(null);
  };

  const filteredMissas = missas.filter(missa =>
    missa.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    missa.data.includes(searchTerm)
  );

  const filteredMusicos = musicos.filter(musico =>
    musico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    musico.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMissas: missas.length,
    totalMusicos: musicos.length,
    musicosDisponiveis: musicos.filter(m => m.disponivel).length,
    sugestoesPendentes: musicos.reduce((acc, m) => acc + m.sugestoes.filter(s => s.status === 'pendente').length, 0)
  };

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                🎵 Sistema de Música Litúrgica
              </h1>
              <p className="text-gray-600 mt-1">Organização completa para missas católicas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hoje</p>
              <p className="text-lg font-medium capitalize">{hoje}</p>
            </div>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard de Estatísticas - apenas na aba missas */}
        {activeTab === 'missas' && !selectedMissa && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total de Missas</p>
                  <p className="text-2xl font-bold">{stats.totalMissas}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Músicos Cadastrados</p>
                  <p className="text-2xl font-bold">{stats.totalMusicos}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <Music className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Disponíveis</p>
                  <p className="text-2xl font-bold">{stats.musicosDisponiveis}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Sugestões Pendentes</p>
                  <p className="text-2xl font-bold">{stats.sugestoesPendentes}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Barra de busca e ações - não mostrar na busca e histórico */}
        {!['buscar', 'historico'].includes(activeTab) && !selectedMissa && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {activeTab === 'missas' && (
              <Button onClick={() => setShowMissaForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Missa
              </Button>
            )}
            
            {activeTab === 'musicos' && (
              <Button onClick={() => setShowMusicoForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Músico
              </Button>
            )}
          </div>
        )}

        {/* Conteúdo das abas */}
        {activeTab === 'missas' && (
          <div className="space-y-6">
            {selectedMissa ? (
              <MissaDetalhes
                missa={selectedMissa}
                onAddMusica={adicionarMusicaNaMissa}
                onRemoveMusica={removerMusicaDaMissa}
                onBack={() => setSelectedMissa(null)}
              />
            ) : showMissaForm || editingMissa ? (
              <MissaForm
                missa={editingMissa || undefined}
                onSave={handleSaveMissa}
                onCancel={() => {
                  setShowMissaForm(false);
                  setEditingMissa(null);
                }}
              />
            ) : (
              <>
                {filteredMissas.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma missa cadastrada
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Comece cadastrando sua primeira missa
                      </p>
                      <Button onClick={() => setShowMissaForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar primeira missa
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMissas.map((missa) => (
                      <MissaCard
                        key={missa.id}
                        missa={missa}
                        onEdit={setEditingMissa}
                        onDelete={removerMissa}
                        onView={setSelectedMissa}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'musicos' && (
          <div className="space-y-6">
            {showMusicoForm || editingMusico ? (
              <MusicoForm
                musico={editingMusico || undefined}
                onSave={handleSaveMusico}
                onCancel={() => {
                  setShowMusicoForm(false);
                  setEditingMusico(null);
                }}
              />
            ) : (
              <>
                {filteredMusicos.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum músico cadastrado
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Comece cadastrando os músicos da sua equipe
                      </p>
                      <Button onClick={() => setShowMusicoForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Cadastrar primeiro músico
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMusicos.map((musico) => (
                      <MusicoCard
                        key={musico.id}
                        musico={musico}
                        onEdit={setEditingMusico}
                        onDelete={removerMusico}
                        onAddAnotacao={adicionarAnotacao}
                        onRemoveAnotacao={removerAnotacao}
                        onAddSugestao={adicionarSugestao}
                        onUpdateSugestaoStatus={atualizarStatusSugestao}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'musicas' && (
          <Card>
            <CardHeader>
              <CardTitle>🎼 Biblioteca de Músicas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                Em breve: Biblioteca completa de músicas litúrgicas com 
                partituras, áudios e organização por categorias.
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'buscar' && <BuscarMusicas />}
        
        {activeTab === 'historico' && <HistoricoMissas missas={missas} />}
      </main>
    </div>
  );
};

export default Index;
