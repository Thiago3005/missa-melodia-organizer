import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, Music, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface AnalyticsData {
  missasPorMes: Array<{ mes: string; quantidade: number }>;
  musicosMaisAtuantes: Array<{ nome: string; participacoes: number }>;
  sugestoesPorStatus: Array<{ status: string; quantidade: number; cor: string }>;
  musicasMaisUsadas: Array<{ nome: string; usos: number }>;
  disponibilidadeCoral: Array<{ data: string; disponivel: number; total: number }>;
  partesMissaCarentes: Array<{ parte: string; preenchimento: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await get('/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Dados mock para demonstração
      setAnalytics({
        missasPorMes: [
          { mes: 'Jan', quantidade: 15 },
          { mes: 'Fev', quantidade: 12 },
          { mes: 'Mar', quantidade: 18 },
          { mes: 'Abr', quantidade: 16 },
          { mes: 'Mai', quantidade: 20 },
          { mes: 'Jun', quantidade: 14 }
        ],
        musicosMaisAtuantes: [
          { nome: 'João Silva', participacoes: 45 },
          { nome: 'Maria Santos', participacoes: 38 },
          { nome: 'Pedro Costa', participacoes: 32 },
          { nome: 'Ana Lima', participacoes: 28 },
          { nome: 'Carlos Rocha', participacoes: 24 }
        ],
        sugestoesPorStatus: [
          { status: 'Pendente', quantidade: 8, cor: '#FFBB28' },
          { status: 'Aprovada', quantidade: 12, cor: '#00C49F' },
          { status: 'Recusada', quantidade: 3, cor: '#FF8042' }
        ],
        musicasMaisUsadas: [
          { nome: 'Ave Maria', usos: 25 },
          { nome: 'Kyrie Eleison', usos: 22 },
          { nome: 'Gloria in Excelsis', usos: 18 },
          { nome: 'Sanctus', usos: 16 },
          { nome: 'Agnus Dei', usos: 14 }
        ],
        disponibilidadeCoral: [
          { data: '2024-01', disponivel: 15, total: 18 },
          { data: '2024-02', disponivel: 16, total: 18 },
          { data: '2024-03', disponivel: 12, total: 18 },
          { data: '2024-04', disponivel: 17, total: 18 },
          { data: '2024-05', disponivel: 14, total: 18 },
          { data: '2024-06', disponivel: 18, total: 18 }
        ],
        partesMissaCarentes: [
          { parte: 'Entrada', preenchimento: 85 },
          { parte: 'Ofertório', preenchimento: 70 },
          { parte: 'Comunhão', preenchimento: 90 },
          { parte: 'Saída', preenchimento: 60 },
          { parte: 'Kyrie', preenchimento: 95 },
          { parte: 'Gloria', preenchimento: 80 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando análises...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar análises
        </h3>
        <p className="text-gray-600">
          Não foi possível carregar os dados analíticos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Analítico</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Últimos 6 meses
        </Badge>
      </div>

      {/* Missas por Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Missas por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.missasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Músicos Mais Atuantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Músicos Mais Atuantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.musicosMaisAtuantes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="participacoes" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sugestões por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Sugestões por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.sugestoesPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, quantidade }) => `${status}: ${quantidade}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {analytics.sugestoesPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Músicas Mais Usadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Músicas Mais Usadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.musicasMaisUsadas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usos" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Disponibilidade do Coral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Disponibilidade do Coral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.disponibilidadeCoral}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="disponivel" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Disponíveis"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Partes da Missa Mais Carentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Partes da Missa - Preenchimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.partesMissaCarentes.map((parte) => (
              <div key={parte.parte} className="flex items-center justify-between">
                <span className="font-medium">{parte.parte}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        parte.preenchimento >= 80 ? 'bg-green-500' : 
                        parte.preenchimento >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${parte.preenchimento}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{parte.preenchimento}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}