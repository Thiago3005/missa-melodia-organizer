import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Edit, Trash2, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Disponibilidade {
  id: string;
  musico_id: string;
  data_inicio: string;
  data_fim: string;
  motivo: string;
  motivo_personalizado?: string;
  observacoes?: string;
  created_at: string;
}

interface DisponibilidadeManagerProps {
  musicoId: string;
  musicoNome: string;
  onClose: () => void;
}

export function DisponibilidadeManager({ musicoId, musicoNome, onClose }: DisponibilidadeManagerProps) {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    data_inicio: '',
    data_fim: '',
    motivo: '',
    motivo_personalizado: '',
    observacoes: ''
  });

  const motivos = [
    { value: 'ferias', label: 'Férias' },
    { value: 'doenca', label: 'Doença' },
    { value: 'compromisso_pessoal', label: 'Compromisso Pessoal' },
    { value: 'outro', label: 'Outro' }
  ];

  useEffect(() => {
    fetchDisponibilidades();
  }, [musicoId]);

  const fetchDisponibilidades = async () => {
    try {
      const response = await fetch(`/api/musicos/${musicoId}/disponibilidade`);
      if (response.ok) {
        const data = await response.json();
        setDisponibilidades(data);
      }
    } catch (error) {
      console.error('Erro ao buscar disponibilidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data_inicio || !formData.data_fim || !formData.motivo) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    try {
      const url = editingId 
        ? `/api/disponibilidade/${editingId}`
        : `/api/musicos/${musicoId}/disponibilidade`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Disponibilidade ${editingId ? 'atualizada' : 'registrada'} com sucesso!`
        });
        
        resetForm();
        fetchDisponibilidades();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar disponibilidade',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (disponibilidade: Disponibilidade) => {
    setFormData({
      data_inicio: disponibilidade.data_inicio,
      data_fim: disponibilidade.data_fim,
      motivo: disponibilidade.motivo,
      motivo_personalizado: disponibilidade.motivo_personalizado || '',
      observacoes: disponibilidade.observacoes || ''
    });
    setEditingId(disponibilidade.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta indisponibilidade?')) return;

    try {
      const response = await fetch(`/api/disponibilidade/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Indisponibilidade removida com sucesso!'
        });
        fetchDisponibilidades();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao remover indisponibilidade',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      data_inicio: '',
      data_fim: '',
      motivo: '',
      motivo_personalizado: '',
      observacoes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getMotivoLabel = (motivo: string, motivoPersonalizado?: string) => {
    if (motivo === 'outro' && motivoPersonalizado) {
      return motivoPersonalizado;
    }
    return motivos.find(m => m.value === motivo)?.label || motivo;
  };

  const getMotivoColor = (motivo: string) => {
    switch (motivo) {
      case 'ferias': return 'bg-blue-100 text-blue-800';
      case 'doenca': return 'bg-red-100 text-red-800';
      case 'compromisso_pessoal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6" />
            Disponibilidade - {musicoNome}
          </h2>
          <p className="text-gray-600 mt-1">Gerencie as indisponibilidades do músico</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="h-4 w-4 mr-2" />
            Nova Indisponibilidade
          </Button>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar' : 'Registrar'} Indisponibilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_inicio">Data Início *</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_fim">Data Fim *</Label>
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="motivo">Motivo *</Label>
                <Select value={formData.motivo} onValueChange={(value) => setFormData({...formData, motivo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {motivos.map(motivo => (
                      <SelectItem key={motivo.value} value={motivo.value}>
                        {motivo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.motivo === 'outro' && (
                <div>
                  <Label htmlFor="motivo_personalizado">Especificar Motivo *</Label>
                  <Input
                    id="motivo_personalizado"
                    value={formData.motivo_personalizado}
                    onChange={(e) => setFormData({...formData, motivo_personalizado: e.target.value})}
                    placeholder="Descreva o motivo..."
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações adicionais (opcional)"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Atualizar' : 'Registrar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Indisponibilidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Indisponibilidades Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Carregando...</p>
          ) : disponibilidades.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma indisponibilidade registrada
            </p>
          ) : (
            <div className="space-y-4">
              {disponibilidades.map((disponibilidade) => (
                <div key={disponibilidade.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getMotivoColor(disponibilidade.motivo)}>
                        {getMotivoLabel(disponibilidade.motivo, disponibilidade.motivo_personalizado)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {disponibilidade.data_inicio === disponibilidade.data_fim 
                          ? new Date(disponibilidade.data_inicio).toLocaleDateString('pt-BR')
                          : `${new Date(disponibilidade.data_inicio).toLocaleDateString('pt-BR')} até ${new Date(disponibilidade.data_fim).toLocaleDateString('pt-BR')}`
                        }
                      </div>
                    </div>
                    {disponibilidade.observacoes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {disponibilidade.observacoes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(disponibilidade)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(disponibilidade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}