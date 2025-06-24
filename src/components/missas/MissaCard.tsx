
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Music, Eye } from 'lucide-react';
import { Missa } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MissaCardProps {
  missa: Missa;
  onEdit: (missa: Missa) => void;
  onDelete: (id: string) => void;
  onView?: (missa: Missa) => void;
}

export function MissaCard({ missa, onEdit, onDelete, onView }: MissaCardProps) {
  const dataFormatada = format(new Date(missa.data), 'dd/MM/yyyy', { locale: ptBR });
  const totalMusicas = missa.musicas.length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold">{missa.tipo}</span>
          <Badge variant="outline">
            {totalMusicas} música{totalMusicas !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{dataFormatada}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{missa.horario}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{missa.musicosEscalados.length} músico{missa.musicosEscalados.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Music className="h-4 w-4 mr-2" />
            <span>{totalMusicas} música{totalMusicas !== 1 ? 's' : ''} cadastrada{totalMusicas !== 1 ? 's' : ''}</span>
          </div>

          {missa.observacoes && (
            <p className="text-sm text-gray-500 italic">{missa.observacoes}</p>
          )}

          <div className="flex gap-2 pt-2">
            {onView && (
              <Button onClick={() => onView(missa)} size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            )}
            <Button onClick={() => onEdit(missa)} size="sm" className="flex-1">
              Editar
            </Button>
            <Button onClick={() => onDelete(missa.id)} variant="destructive" size="sm">
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
