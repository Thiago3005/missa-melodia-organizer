
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SupabaseMusico {
  id: string;
  nome: string;
  funcao: string;
  disponivel: boolean;
  email?: string;
  telefone?: string;
  foto?: string;
  observacoes_permanentes?: string;
  created_at: string;
  updated_at: string;
}

export interface MusicoAnotacao {
  id: string;
  musico_id: string;
  texto: string;
  created_at: string;
}

export interface MusicoSugestao {
  id: string;
  musico_id: string;
  texto: string;
  status: 'pendente' | 'implementada' | 'recusada';
  created_at: string;
  updated_at: string;
}

export function useSupabaseMusicos() {
  const [musicos, setMusicos] = useState<SupabaseMusico[]>([]);
  const [anotacoes, setAnotacoes] = useState<Record<string, MusicoAnotacao[]>>({});
  const [sugestoes, setSugestoes] = useState<Record<string, MusicoSugestao[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchMusicos = async () => {
    try {
      const { data, error } = await supabase
        .from('musicos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setMusicos(data || []);
      
      // Buscar anotações e sugestões para cada músico
      if (data) {
        await Promise.all([
          fetchTodasAnotacoes(data.map(m => m.id)),
          fetchTodasSugestoes(data.map(m => m.id))
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar músicos:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar músicos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodasAnotacoes = async (musicoIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('musico_anotacoes')
        .select('*')
        .in('musico_id', musicoIds)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const anotacoesPorMusico = (data || []).reduce((acc, anotacao) => {
        if (!acc[anotacao.musico_id]) acc[anotacao.musico_id] = [];
        acc[anotacao.musico_id].push(anotacao);
        return acc;
      }, {} as Record<string, MusicoAnotacao[]>);
      
      setAnotacoes(anotacoesPorMusico);
    } catch (error) {
      console.error('Erro ao buscar anotações:', error);
    }
  };

  const fetchTodasSugestoes = async (musicoIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('musico_sugestoes')
        .select('*')
        .in('musico_id', musicoIds)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const sugestoesPorMusico = (data || []).reduce((acc, sugestao) => {
        if (!acc[sugestao.musico_id]) acc[sugestao.musico_id] = [];
        acc[sugestao.musico_id].push(sugestao);
        return acc;
      }, {} as Record<string, MusicoSugestao[]>);
      
      setSugestoes(sugestoesPorMusico);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const adicionarMusico = async (musico: Omit<SupabaseMusico, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('musicos')
        .insert([musico])
        .select()
        .single();

      if (error) throw error;
      
      setMusicos(prev => [...prev, data]);
      toast({ title: 'Sucesso', description: 'Músico criado com sucesso!' });
      return data.id;
    } catch (error) {
      console.error('Erro ao criar músico:', error);
      toast({ title: 'Erro', description: 'Falha ao criar músico', variant: 'destructive' });
      return null;
    }
  };

  const atualizarMusico = async (id: string, updates: Partial<SupabaseMusico>) => {
    try {
      const { data, error } = await supabase
        .from('musicos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMusicos(prev => prev.map(musico => musico.id === id ? data : musico));
      toast({ title: 'Sucesso', description: 'Músico atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar músico:', error);
      toast({ title: 'Erro', description: 'Falha ao atualizar músico', variant: 'destructive' });
    }
  };

  const removerMusico = async (id: string) => {
    try {
      const { error } = await supabase
        .from('musicos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMusicos(prev => prev.filter(musico => musico.id !== id));
      setAnotacoes(prev => {
        const novo = { ...prev };
        delete novo[id];
        return novo;
      });
      setSugestoes(prev => {
        const novo = { ...prev };
        delete novo[id];
        return novo;
      });
      toast({ title: 'Sucesso', description: 'Músico removido com sucesso!' });
    } catch (error) {
      console.error('Erro ao remover músico:', error);
      toast({ title: 'Erro', description: 'Falha ao remover músico', variant: 'destructive' });
    }
  };

  const adicionarAnotacao = async (musicoId: string, texto: string) => {
    try {
      const { data, error } = await supabase
        .from('musico_anotacoes')
        .insert([{ musico_id: musicoId, texto }])
        .select()
        .single();

      if (error) throw error;
      
      setAnotacoes(prev => ({
        ...prev,
        [musicoId]: [...(prev[musicoId] || []), data]
      }));
      
      toast({ title: 'Sucesso', description: 'Anotação adicionada!' });
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error);
      toast({ title: 'Erro', description: 'Falha ao adicionar anotação', variant: 'destructive' });
    }
  };

  const removerAnotacao = async (anotacaoId: string, musicoId: string) => {
    try {
      const { error } = await supabase
        .from('musico_anotacoes')
        .delete()
        .eq('id', anotacaoId);

      if (error) throw error;
      
      setAnotacoes(prev => ({
        ...prev,
        [musicoId]: prev[musicoId]?.filter(a => a.id !== anotacaoId) || []
      }));
      
      toast({ title: 'Sucesso', description: 'Anotação removida!' });
    } catch (error) {
      console.error('Erro ao remover anotação:', error);
      toast({ title: 'Erro', description: 'Falha ao remover anotação', variant: 'destructive' });
    }
  };

  const adicionarSugestao = async (musicoId: string, texto: string) => {
    try {
      const { data, error } = await supabase
        .from('musico_sugestoes')
        .insert([{ musico_id: musicoId, texto }])
        .select()
        .single();

      if (error) throw error;
      
      setSugestoes(prev => ({
        ...prev,
        [musicoId]: [...(prev[musicoId] || []), data]
      }));
      
      toast({ title: 'Sucesso', description: 'Sugestão adicionada!' });
    } catch (error) {
      console.error('Erro ao adicionar sugestão:', error);
      toast({ title: 'Erro', description: 'Falha ao adicionar sugestão', variant: 'destructive' });
    }
  };

  const atualizarStatusSugestao = async (sugestaoId: string, musicoId: string, status: MusicoSugestao['status']) => {
    try {
      const { data, error } = await supabase
        .from('musico_sugestoes')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', sugestaoId)
        .select()
        .single();

      if (error) throw error;
      
      setSugestoes(prev => ({
        ...prev,
        [musicoId]: prev[musicoId]?.map(s => s.id === sugestaoId ? data : s) || []
      }));
      
      toast({ title: 'Sucesso', description: 'Status da sugestão atualizado!' });
    } catch (error) {
      console.error('Erro ao atualizar sugestão:', error);
      toast({ title: 'Erro', description: 'Falha ao atualizar sugestão', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchMusicos();
  }, []);

  return {
    musicos,
    anotacoes,
    sugestoes,
    loading,
    adicionarMusico,
    atualizarMusico,
    removerMusico,
    adicionarAnotacao,
    removerAnotacao,
    adicionarSugestao,
    atualizarStatusSugestao,
    refetch: fetchMusicos
  };
}
