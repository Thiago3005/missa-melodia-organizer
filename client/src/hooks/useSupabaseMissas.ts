
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SupabaseMissa {
  id: string;
  data: string;
  horario: string;
  tipo: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMusica {
  id: string;
  missa_id: string;
  nome: string;
  cantor?: string;
  link_youtube?: string;
  partitura?: string;
  link_download?: string;
  secao_liturgica: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export function useSupabaseMissas() {
  const [missas, setMissas] = useState<SupabaseMissa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissas = async () => {
    try {
      const { data, error } = await supabase
        .from('missas')
        .select('*')
        .order('data', { ascending: true });

      if (error) throw error;
      setMissas(data || []);
    } catch (error) {
      console.error('Erro ao buscar missas:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar missas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const adicionarMissa = async (missa: Omit<SupabaseMissa, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('missas')
        .insert([missa])
        .select()
        .single();

      if (error) throw error;
      
      setMissas(prev => [...prev, data]);
      toast({ title: 'Sucesso', description: 'Missa criada com sucesso!' });
      return data.id;
    } catch (error) {
      console.error('Erro ao criar missa:', error);
      toast({ title: 'Erro', description: 'Falha ao criar missa', variant: 'destructive' });
      return null;
    }
  };

  const atualizarMissa = async (id: string, updates: Partial<SupabaseMissa>) => {
    try {
      const { data, error } = await supabase
        .from('missas')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMissas(prev => prev.map(missa => missa.id === id ? data : missa));
      toast({ title: 'Sucesso', description: 'Missa atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar missa:', error);
      toast({ title: 'Erro', description: 'Falha ao atualizar missa', variant: 'destructive' });
    }
  };

  const removerMissa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('missas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMissas(prev => prev.filter(missa => missa.id !== id));
      toast({ title: 'Sucesso', description: 'Missa removida com sucesso!' });
    } catch (error) {
      console.error('Erro ao remover missa:', error);
      toast({ title: 'Erro', description: 'Falha ao remover missa', variant: 'destructive' });
    }
  };

  const fetchMusicasPorMissa = async (missaId: string): Promise<SupabaseMusica[]> => {
    try {
      const { data, error } = await supabase
        .from('musicas')
        .select('*')
        .eq('missa_id', missaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar músicas da missa:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar músicas', variant: 'destructive' });
      return [];
    }
  };

  const adicionarMusicaNaMissa = async (missaId: string, musica: Omit<SupabaseMusica, 'id' | 'missa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('musicas')
        .insert([{ ...musica, missa_id: missaId }])
        .select()
        .single();

      if (error) throw error;
      
      toast({ title: 'Sucesso', description: 'Música adicionada com sucesso!' });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      toast({ title: 'Erro', description: 'Falha ao adicionar música', variant: 'destructive' });
      return null;
    }
  };

  const removerMusicaDaMissa = async (musicaId: string) => {
    try {
      const { error } = await supabase
        .from('musicas')
        .delete()
        .eq('id', musicaId);

      if (error) throw error;
      
      toast({ title: 'Sucesso', description: 'Música removida com sucesso!' });
    } catch (error) {
      console.error('Erro ao remover música:', error);
      toast({ title: 'Erro', description: 'Falha ao remover música', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchMissas();
  }, []);

  return {
    missas,
    loading,
    adicionarMissa,
    atualizarMissa,
    removerMissa,
    fetchMusicasPorMissa,
    adicionarMusicaNaMissa,
    removerMusicaDaMissa,
    refetch: fetchMissas
  };
}
