
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Play, Download, Save, ExternalLink } from 'lucide-react';
import { useYouTubeAPI, YouTubeVideo } from '../../hooks/useYouTubeAPI';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SECOES_LITURGICAS, SecaoLiturgica } from '../../types';

export function BuscarMusicas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [secaoFiltro, setSecaoFiltro] = useState<SecaoLiturgica | 'todas'>('todas');
  const { videos, loading, searchVideos } = useYouTubeAPI();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Atenção',
        description: 'Digite algo para buscar',
        variant: 'destructive'
      });
      return;
    }

    const searchQuery = secaoFiltro !== 'todas' 
      ? `${searchTerm} música católica ${secaoFiltro}`
      : `${searchTerm} música católica`;
    
    await searchVideos(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const salvarNaBiblioteca = async (video: YouTubeVideo, secao?: SecaoLiturgica) => {
    try {
      const { error } = await supabase
        .from('biblioteca_musicas')
        .insert([{
          nome: video.title,
          cantor: video.channelTitle,
          link_youtube: `https://www.youtube.com/watch?v=${video.id}`,
          secao_liturgica: secao || null,
          youtube_video_id: video.id,
          thumbnail: video.thumbnail,
          duracao: video.duration
        }]);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Música salva na biblioteca!'
      });
    } catch (error) {
      console.error('Erro ao salvar música:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao salvar música na biblioteca',
        variant: 'destructive'
      });
    }
  };

  const downloadMp3 = async (video: YouTubeVideo) => {
    // Implementação para download de MP3
    // Aqui usaríamos um serviço como yt-dlp ou similar
    toast({
      title: 'Download',
      description: `Iniciando download de "${video.title}"...`,
    });
    
    // Por enquanto, vamos abrir um serviço online de conversão
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const converterUrl = `https://www.y2mate.com/youtube/${video.id}`;
    window.open(converterUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Músicas no YouTube
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Digite o nome da música, cantor ou tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            
            <Select value={secaoFiltro} onValueChange={(value) => setSecaoFiltro(value as SecaoLiturgica | 'todas')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por seção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as seções</SelectItem>
                {Object.entries(SECOES_LITURGICAS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da busca */}
      <div className="space-y-4">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-40 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && searchTerm && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600">
                Tente buscar com termos diferentes ou remova o filtro de seção
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">
                    {video.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {video.channelTitle}
                  </p>
                  
                  <p className="text-xs text-gray-500 mb-4">
                    {video.viewCount}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadMp3(video)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      MP3
                    </Button>
                    
                    <Select onValueChange={(secao) => salvarNaBiblioteca(video, secao as SecaoLiturgica)}>
                      <SelectTrigger className="h-8 w-20 text-xs">
                        <Save className="h-3 w-3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salvar-sem-secao">Salvar</SelectItem>
                        {Object.entries(SECOES_LITURGICAS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
