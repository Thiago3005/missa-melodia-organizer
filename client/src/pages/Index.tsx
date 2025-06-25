import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Dashboard } from '../components/Dashboard';
import { MissaCard } from '../components/missas/MissaCard';
import { MissaForm } from '../components/missas/MissaForm';
import { MissaDetalhes } from '../components/missas/MissaDetalhes';
import { MusicoCard } from '../components/musicos/MusicoCard';
import { MusicoForm } from '../components/musicos/MusicoForm';
import { BuscarMusicas } from '../components/buscar/BuscarMusicas';
import { BibliotecaMusicas } from '../components/musicas/BibliotecaMusicas';
import { SugestoesManager } from '../components/sugestoes/SugestoesManager';
import { RelatoriosManager } from '../components/relatorios/RelatoriosManager';
import { HistoricoMissas } from '../components/historico/HistoricoMissas';
import { DisponibilidadeManager } from '../components/disponibilidade/DisponibilidadeManager';
import { PartituraSearch } from '../components/partituras/PartituraSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Calendar, Users, Music, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { useSupabaseMissas, SupabaseMissa } from '../hooks/useApi';
import { useSupabaseMusicos, SupabaseMusico } from '../hooks/useApi';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMissaForm, setShowMissaForm] = useState(false);
  const [showMusicoForm, setShowMusicoForm] = useState(false);
  const [editingMissa, setEditingMissa] = useState<SupabaseMissa | null>(null);
  const [editingMusico, setEditingMusico] = useState<SupabaseMusico | null>(null);
  const [selectedMissa, setSelectedMissa] = useState<SupabaseMissa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [managingDisponibilidade, setManagingDisponibilidade] = useState<{musicoId: string, musicoNome: string} | null>(null);

  const {
    missas,
    loading: loadingMissas,
    adicionarMissa,
    atualizarMissa,
    removerMissa,
    fetchMusicasPorMissa,
    adicionarMusicaNaMissa,
    removerMusicaDaMissa
  } = useSupabaseMissas();

  const {
    musicos,
    anotacoes,
    sugestoes,
    loading: loadingMusicos,
    adicionarMusico,
    atualizarMusico,
    removerMusico,
    adicionarAnotacao,
    removerAnotacao,
    adicionarSugestao,
    atualizarStatusSugestao
  } = useSupabaseMusicos();

  const handleSaveMissa = async (missaData: Omit<SupabaseMissa, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingMissa) {
      await atualizarMissa(editingMissa.id, missaData);
    } else {
      await adicionarMissa(missaData);
    }
    setShowMissaForm(false);
    setEditingMissa(null);
  };

  const handleSaveMusico = async (musicoData: Omit<SupabaseMusico, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingMusico) {
      await atualizarMusico(editingMusico.id, musicoData);
    } else {
      await adicionarMusico(musicoData);
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
    sugestoesPendentes: Object.values(sugestoes).flat().filter(s => s.status === 'pendente').length
  };

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Converter dados para o formato esperado pelos componentes existentes
  const convertMissaForLegacy = (missa: SupabaseMissa) => ({
    id: missa.id,
    data: missa.data,
    horario: missa.horario,
    tipo: missa.tipo,
    musicosEscalados: [],
    musicas: [],
    observacoes: missa.observacoes
  });

  const convertMusicoForLegacy = (musico: SupabaseMusico) => ({
    id: musico.id,
    nome: musico.nome,
    funcao: musico.funcao,
    disponivel: musico.disponivel,
    contato: {
      email: musico.email,
      telefone: musico.telefone
    },
    foto: musico.foto,
    anotacoes: anotacoes[musico.id]?.map(a => a.texto) || [],
    sugestoes: sugestoes[musico.id] || [],
    observacoesPermanentes: musico.observacoes_permanentes
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Música Litúrgica
                </h1>
                <p className="text-sm text-gray-600">
                  Organização completa para missas católicas - Boa Viagem
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Hoje</p>
                <p className="text-lg font-medium capitalize">{hoje}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          
          {activeTab === 'missas' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-8 w-8" />
                    Missas
                  </h1>
                  <p className="text-gray-600 mt-1">Gerencie todas as missas e escalas</p>
                </div>
                <Button 
                  onClick={() => setShowMissaForm(true)}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Missa
                </Button>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por tipo de missa ou data..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              {selectedMissa ? (
                <MissaDetalhes
                  missa={convertMissaForLegacy(selectedMissa)}
                  onAddMusica={async (missaId, musica) => {
                    await adicionarMusicaNaMissa(missaId, musica);
                  }}
                  onRemoveMusica={removerMusicaDaMissa}
                  onBack={() => setSelectedMissa(null)}
                />
              ) : showMissaForm || editingMissa ? (
                <MissaForm
                  missa={editingMissa ? convertMissaForLegacy(editingMissa) : undefined}
                  onSave={handleSaveMissa}
                  onCancel={() => {
                    setShowMissaForm(false);
                    setEditingMissa(null);
                  }}
                />
              ) : (
                <>
                  {loadingMissas ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p>Carregando missas...</p>
                      </CardContent>
                    </Card>
                  ) : filteredMissas.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhuma missa cadastrada
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Comece criando sua primeira missa
                        </p>
                        <Button onClick={() => setShowMissaForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar primeira missa
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMissas.map((missa) => (
                        <Card key={missa.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {missa.tipo}
                                </h3>
                                <div className="text-right text-sm text-gray-600">
                                  {missa.data}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Horário: {missa.horario}</p>
                                <p>Músicos: 0 escalados</p>
                                <p>Músicas: 0 definidas</p>
                              </div>

                              {missa.observacoes && (
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                  {missa.observacoes}
                                </p>
                              )}

                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedMissa(missa)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingMissa(missa)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removerMissa(missa.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'musicos' && !managingDisponibilidade && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-8 w-8" />
                    Músicos
                  </h1>
                  <p className="text-gray-600 mt-1">Gerencie o time de músicos</p>
                </div>
                <Button 
                  onClick={() => setShowMusicoForm(true)}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Músico
                </Button>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome ou função..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              {showMusicoForm || editingMusico ? (
                <MusicoForm
                  musico={editingMusico ? convertMusicoForLegacy(editingMusico) : undefined}
                  onSave={handleSaveMusico}
                  onCancel={() => {
                    setShowMusicoForm(false);
                    setEditingMusico(null);
                  }}
                />
              ) : (
                <>
                  {loadingMusicos ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p>Carregando músicos...</p>
                      </CardContent>
                    </Card>
                  ) : filteredMusicos.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum músico cadastrado
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Comece adicionando o primeiro músico
                        </p>
                        <Button onClick={() => setShowMusicoForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar primeiro músico
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMusicos.map((musico) => (
                        <MusicoCard
                          key={musico.id}
                          musico={convertMusicoForLegacy(musico)}
                          onEdit={() => setEditingMusico(musico)}
                          onDelete={() => removerMusico(musico.id)}
                          onAddAnotacao={async (musicoId, texto) => {
                            await adicionarAnotacao(musicoId, texto);
                          }}
                          onRemoveAnotacao={async (anotacaoId) => {
                            await removerAnotacao(anotacaoId, musico.id);
                          }}
                          onAddSugestao={async (musicoId, texto) => {
                            await adicionarSugestao(musicoId, texto);
                          }}
                          onUpdateSugestaoStatus={async (sugestaoId, status) => {
                            await atualizarStatusSugestao(sugestaoId, status, musico.id);
                          }}
                          onManageDisponibilidade={(musicoId, musicoNome) => {
                            setManagingDisponibilidade({ musicoId, musicoNome });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {managingDisponibilidade && (
            <DisponibilidadeManager
              musicoId={managingDisponibilidade.musicoId}
              musicoNome={managingDisponibilidade.musicoNome}
              onClose={() => setManagingDisponibilidade(null)}
            />
          )}

          {activeTab === 'musicas' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Music className="h-8 w-8" />
                    Biblioteca de Músicas
                  </h1>
                  <p className="text-gray-600 mt-1">Catálogo completo de músicas litúrgicas</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <PartituraSearch />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buscar no YouTube</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BuscarMusicas />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Biblioteca Salva</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BibliotecaMusicas />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sugestoes' && <SugestoesManager />}
          {activeTab === 'relatorios' && <RelatoriosManager />}
        </main>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;