
-- Criar tabela para músicos
CREATE TABLE public.musicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  email TEXT,
  telefone TEXT,
  foto TEXT,
  observacoes_permanentes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para anotações dos músicos
CREATE TABLE public.musico_anotacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  musico_id UUID REFERENCES public.musicos(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para sugestões dos músicos
CREATE TABLE public.musico_sugestoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  musico_id UUID REFERENCES public.musicos(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'implementada', 'recusada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para missas
CREATE TABLE public.missas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  tipo TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para músicos escalados nas missas
CREATE TABLE public.missa_musicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  missa_id UUID REFERENCES public.missas(id) ON DELETE CASCADE NOT NULL,
  musico_id UUID REFERENCES public.musicos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(missa_id, musico_id)
);

-- Criar tabela para músicas
CREATE TABLE public.musicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  missa_id UUID REFERENCES public.missas(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  cantor TEXT,
  link_youtube TEXT,
  partitura TEXT,
  link_download TEXT,
  secao_liturgica TEXT NOT NULL CHECK (secao_liturgica IN (
    'entrada', 'ato-penitencial', 'gloria', 'salmo-responsorial',
    'aclamacao-evangelho', 'ofertorio', 'santo', 'cordeiro',
    'comunhao', 'acao-gracas', 'final'
  )),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para biblioteca de músicas (músicas salvas)
CREATE TABLE public.biblioteca_musicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cantor TEXT,
  link_youtube TEXT,
  partitura TEXT,
  link_download TEXT,
  secao_liturgica TEXT CHECK (secao_liturgica IN (
    'entrada', 'ato-penitencial', 'gloria', 'salmo-responsorial',
    'aclamacao-evangelho', 'ofertorio', 'santo', 'cordeiro',
    'comunhao', 'acao-gracas', 'final'
  )),
  observacoes TEXT,
  youtube_video_id TEXT,
  thumbnail TEXT,
  duracao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.musicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musico_anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musico_sugestoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missa_musicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca_musicas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitindo acesso público por enquanto - pode ser refinado depois)
CREATE POLICY "Allow all operations on musicos" ON public.musicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on musico_anotacoes" ON public.musico_anotacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on musico_sugestoes" ON public.musico_sugestoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on missas" ON public.missas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on missa_musicos" ON public.missa_musicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on musicas" ON public.musicas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on biblioteca_musicas" ON public.biblioteca_musicas FOR ALL USING (true) WITH CHECK (true);
