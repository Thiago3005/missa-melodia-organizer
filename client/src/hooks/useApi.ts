import { useState, useEffect } from 'react';

const API_BASE = '/api';

export interface SupabaseMissa {
  id: string;
  data: string;
  horario: string;
  tipo: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

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

export interface Musica {
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

export interface BibliotecaMusica {
  id: string;
  nome: string;
  cantor?: string;
  link_youtube?: string;
  partitura?: string;
  link_download?: string;
  secao_liturgica?: string;
  observacoes?: string;
  youtube_video_id?: string;
  thumbnail?: string;
  duracao?: string;
  created_at: string;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export function useSupabaseMissas() {
  const [missas, setMissas] = useState<SupabaseMissa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMissas = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/missas');
      setMissas(data);
    } catch (error) {
      console.error('Error fetching missas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissas();
  }, []);

  const adicionarMissa = async (missaData: Omit<SupabaseMissa, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMissa = await apiRequest('/missas', {
        method: 'POST',
        body: JSON.stringify(missaData),
      });
      setMissas(prev => [...prev, newMissa]);
      return newMissa;
    } catch (error) {
      console.error('Error creating missa:', error);
      throw error;
    }
  };

  const atualizarMissa = async (id: string, missaData: Partial<SupabaseMissa>) => {
    try {
      const updatedMissa = await apiRequest(`/missas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(missaData),
      });
      setMissas(prev => prev.map(m => m.id === id ? updatedMissa : m));
      return updatedMissa;
    } catch (error) {
      console.error('Error updating missa:', error);
      throw error;
    }
  };

  const removerMissa = async (id: string) => {
    try {
      await apiRequest(`/missas/${id}`, { method: 'DELETE' });
      setMissas(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting missa:', error);
      throw error;
    }
  };

  const fetchMusicasPorMissa = async (missaId: string): Promise<Musica[]> => {
    try {
      return await apiRequest(`/missas/${missaId}/musicas`);
    } catch (error) {
      console.error('Error fetching musicas:', error);
      return [];
    }
  };

  const adicionarMusicaNaMissa = async (musicaData: Omit<Musica, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      return await apiRequest('/musicas', {
        method: 'POST',
        body: JSON.stringify(musicaData),
      });
    } catch (error) {
      console.error('Error creating musica:', error);
      throw error;
    }
  };

  const removerMusicaDaMissa = async (musicaId: string) => {
    try {
      await apiRequest(`/musicas/${musicaId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting musica:', error);
      throw error;
    }
  };

  return {
    missas,
    loading,
    adicionarMissa,
    atualizarMissa,
    removerMissa,
    fetchMusicasPorMissa,
    adicionarMusicaNaMissa,
    removerMusicaDaMissa,
  };
}

export function useSupabaseMusicos() {
  const [musicos, setMusicos] = useState<SupabaseMusico[]>([]);
  const [anotacoes, setAnotacoes] = useState<Record<string, any[]>>({});
  const [sugestoes, setSugestoes] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchMusicos = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/musicos');
      setMusicos(data);
    } catch (error) {
      console.error('Error fetching musicos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicos();
  }, []);

  const adicionarMusico = async (musicoData: Omit<SupabaseMusico, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMusico = await apiRequest('/musicos', {
        method: 'POST',
        body: JSON.stringify(musicoData),
      });
      setMusicos(prev => [...prev, newMusico]);
      return newMusico;
    } catch (error) {
      console.error('Error creating musico:', error);
      throw error;
    }
  };

  const atualizarMusico = async (id: string, musicoData: Partial<SupabaseMusico>) => {
    try {
      const updatedMusico = await apiRequest(`/musicos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(musicoData),
      });
      setMusicos(prev => prev.map(m => m.id === id ? updatedMusico : m));
      return updatedMusico;
    } catch (error) {
      console.error('Error updating musico:', error);
      throw error;
    }
  };

  const removerMusico = async (id: string) => {
    try {
      await apiRequest(`/musicos/${id}`, { method: 'DELETE' });
      setMusicos(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting musico:', error);
      throw error;
    }
  };

  const adicionarAnotacao = async (musicoId: string, texto: string) => {
    try {
      const newAnotacao = await apiRequest(`/musicos/${musicoId}/anotacoes`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
      });
      setAnotacoes(prev => ({
        ...prev,
        [musicoId]: [...(prev[musicoId] || []), newAnotacao]
      }));
      return newAnotacao;
    } catch (error) {
      console.error('Error creating anotacao:', error);
      throw error;
    }
  };

  const removerAnotacao = async (anotacaoId: string, musicoId: string) => {
    try {
      await apiRequest(`/anotacoes/${anotacaoId}`, { method: 'DELETE' });
      setAnotacoes(prev => ({
        ...prev,
        [musicoId]: prev[musicoId]?.filter(a => a.id !== anotacaoId) || []
      }));
    } catch (error) {
      console.error('Error deleting anotacao:', error);
      throw error;
    }
  };

  const adicionarSugestao = async (musicoId: string, texto: string) => {
    try {
      const newSugestao = await apiRequest(`/musicos/${musicoId}/sugestoes`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
      });
      setSugestoes(prev => ({
        ...prev,
        [musicoId]: [...(prev[musicoId] || []), newSugestao]
      }));
      return newSugestao;
    } catch (error) {
      console.error('Error creating sugestao:', error);
      throw error;
    }
  };

  const atualizarStatusSugestao = async (sugestaoId: string, status: string, musicoId: string) => {
    try {
      const updatedSugestao = await apiRequest(`/sugestoes/${sugestaoId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setSugestoes(prev => ({
        ...prev,
        [musicoId]: prev[musicoId]?.map(s => s.id === sugestaoId ? updatedSugestao : s) || []
      }));
      return updatedSugestao;
    } catch (error) {
      console.error('Error updating sugestao:', error);
      throw error;
    }
  };

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
  };
}

export function useBibliotecaMusicas() {
  const [musicas, setMusicas] = useState<BibliotecaMusica[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMusicas = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/biblioteca-musicas');
      setMusicas(data);
    } catch (error) {
      console.error('Error fetching biblioteca musicas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicas();
  }, []);

  const adicionarMusica = async (musicaData: Omit<BibliotecaMusica, 'id' | 'created_at'>) => {
    try {
      const newMusica = await apiRequest('/biblioteca-musicas', {
        method: 'POST',
        body: JSON.stringify(musicaData),
      });
      setMusicas(prev => [...prev, newMusica]);
      return newMusica;
    } catch (error) {
      console.error('Error creating biblioteca musica:', error);
      throw error;
    }
  };

  const removerMusica = async (id: string) => {
    try {
      await apiRequest(`/biblioteca-musicas/${id}`, { method: 'DELETE' });
      setMusicas(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting biblioteca musica:', error);
      throw error;
    }
  };

  return {
    musicas,
    loading,
    adicionarMusica,
    removerMusica,
  };
}

// General API hook for making HTTP requests
export function useApi() {
  const get = async (endpoint: string) => {
    return apiRequest(endpoint);
  };

  const post = async (endpoint: string, data?: any) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const put = async (endpoint: string, data?: any) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const del = async (endpoint: string) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
}