
import { useState } from 'react';
import { Search, Music, Youtube, Download, ExternalLink, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface YouTubeResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  url: string;
}

interface SearchResults {
  youtube: YouTubeResult[];
  cifrasGoiania: string;
  cnvMp3Generator: string;
}

export function BuscarMusicas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<YouTubeResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { get, post } = useApi();

  const [formData, setFormData] = useState({
    nome: '',
    cantor: '',
    link_youtube: '',
    partitura_texto: '',
    link_download: '',
    secao_liturgica: '',
    observacoes: '',
    youtube_video_id: '',
    thumbnail: '',
    duracao: '',
    link_cifras_goiania: ''
  });

  const secoesLiturgicas = [
    'Entrada',
    'Ato Penitencial',
    'Glória',
    'Salmo Responsorial',
    'Aclamação ao Evangelho',
    'Ofertório',
    'Santo',
    'Cordeiro de Deus',
    'Comunhão',
    'Final'
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await get(`/api/search/music?q=${encodeURIComponent(searchTerm)}`);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar músicas');
    }
    setIsSearching(false);
  };

  const handleSelectMusic = (music: YouTubeResult) => {
    setSelectedMusic(music);
    setFormData({
      nome: music.title,
      cantor: music.channelTitle,
      link_youtube: music.url,
      partitura_texto: '',
      link_download: '',
      secao_liturgica: '',
      observacoes: '',
      youtube_video_id: music.id,
      thumbnail: music.thumbnail,
      duracao: music.duration,
      link_cifras_goiania: searchResults?.cifrasGoiania || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveToLibrary = async () => {
    try {
      await post('/api/biblioteca-musicas', formData);
      toast.success('Música adicionada à biblioteca com sucesso!');
      setIsDialogOpen(false);
      setFormData({
        nome: '',
        cantor: '',
        link_youtube: '',
        partitura_texto: '',
        link_download: '',
        secao_liturgica: '',
        observacoes: '',
        youtube_video_id: '',
        thumbnail: '',
        duracao: '',
        link_cifras_goiania: ''
      });
    } catch (error) {
      console.error('Erro ao salvar música:', error);
      toast.error('Erro ao salvar música na biblioteca');
    }
  };

  const handleGenerateMP3Link = async (youtubeUrl: string) => {
    try {
      const response = await post('/api/search/youtube-to-mp3', { youtubeUrl });
      window.open(response.mp3Link, '_blank');
    } catch (error) {
      console.error('Erro ao gerar link MP3:', error);
      toast.error('Erro ao gerar link de download');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Buscar Músicas</h1>
        <p className="text-gray-600">
          Sistema inteligente de busca de partituras e recursos litúrgicos
        </p>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca Inteligente de Partituras
          </CardTitle>
          <CardDescription>
            Digite o nome da música para encontrar no YouTube, Cifras e Partituras da Arquidiocese de Goiânia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome da música..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links rápidos */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(searchResults.cifrasGoiania, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Cifras e Partituras - Goiânia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(searchResults.cnvMp3Generator, '_blank')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                CNV MP3 (Download de Áudio)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados do YouTube */}
      {searchResults?.youtube && searchResults.youtube.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              Resultados do YouTube
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.youtube.map((result) => (
                <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                      {result.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {result.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {result.channelTitle}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(result.url, '_blank')}
                        className="flex-1"
                      >
                        <Youtube className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSelectMusic(result)}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => handleGenerateMP3Link(result.url)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar MP3
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para adicionar música à biblioteca */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar à Biblioteca</DialogTitle>
            <DialogDescription>
              Complete as informações da música para adicionar à biblioteca
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome *
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantor" className="text-right">
                Cantor/Artista
              </Label>
              <Input
                id="cantor"
                value={formData.cantor}
                onChange={(e) => setFormData({ ...formData, cantor: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secao_liturgica" className="text-right">
                Seção Litúrgica
              </Label>
              <Select
                value={formData.secao_liturgica}
                onValueChange={(value) => setFormData({ ...formData, secao_liturgica: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a seção" />
                </SelectTrigger>
                <SelectContent>
                  {secoesLiturgicas.map((secao) => (
                    <SelectItem key={secao} value={secao}>
                      {secao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link_youtube" className="text-right">
                Link YouTube
              </Label>
              <Input
                id="link_youtube"
                value={formData.link_youtube}
                onChange={(e) => setFormData({ ...formData, link_youtube: e.target.value })}
                className="col-span-3"
                readOnly
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link_download" className="text-right">
                Link Download
              </Label>
              <Input
                id="link_download"
                value={formData.link_download}
                onChange={(e) => setFormData({ ...formData, link_download: e.target.value })}
                className="col-span-3"
                placeholder="Link para download da música"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="partitura_texto" className="text-right pt-2">
                Partitura (Texto)
              </Label>
              <Textarea
                id="partitura_texto"
                value={formData.partitura_texto}
                onChange={(e) => setFormData({ ...formData, partitura_texto: e.target.value })}
                className="col-span-3 min-h-[120px] font-mono"
                placeholder="Cole aqui o texto da partitura, cifras ou acordes..."
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="observacoes" className="text-right pt-2">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="col-span-3"
                placeholder="Observações adicionais sobre a música..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveToLibrary} disabled={!formData.nome}>
              Salvar na Biblioteca
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
      const response = await post('/api/search/youtube-to-mp3', { youtubeUrl });
      window.open(response.mp3Link, '_blank');
    } catch (error) {
      console.error('Erro ao gerar link MP3:', error);
      toast.error('Erro ao gerar link de download');
    }
  };
        youtube_video_id: video.id,
        thumbnail: video.thumbnail,
        duracao: video.duration
      });

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
