import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authRouter } from "./authRoutes";
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from "./auth";
import { MusicSearchService } from "./musicSearchService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.use('/api/auth', authRouter);

  // Musicos routes
  app.get("/api/musicos", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const musicos = await storage.getMusicos();
      res.json(musicos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch musicos" });
    }
  });

  app.post("/api/musicos", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const musico = await storage.createMusico(req.body);
      res.json(musico);
    } catch (error) {
      res.status(500).json({ error: "Failed to create musico" });
    }
  });

  app.put("/api/musicos/:id", async (req, res) => {
    try {
      const musico = await storage.updateMusico(req.params.id, req.body);
      res.json(musico);
    } catch (error) {
      res.status(500).json({ error: "Failed to update musico" });
    }
  });

  app.delete("/api/musicos/:id", async (req, res) => {
    try {
      await storage.deleteMusico(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete musico" });
    }
  });

  // Missas routes
  app.get("/api/missas", async (req, res) => {
    try {
      const missas = await storage.getMissas();
      res.json(missas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch missas" });
    }
  });

  app.post("/api/missas", async (req, res) => {
    try {
      const missa = await storage.createMissa(req.body);
      res.json(missa);
    } catch (error) {
      res.status(500).json({ error: "Failed to create missa" });
    }
  });

  app.put("/api/missas/:id", async (req, res) => {
    try {
      const missa = await storage.updateMissa(req.params.id, req.body);
      res.json(missa);
    } catch (error) {
      res.status(500).json({ error: "Failed to update missa" });
    }
  });

  app.delete("/api/missas/:id", async (req, res) => {
    try {
      await storage.deleteMissa(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete missa" });
    }
  });

  // Musicas routes
  app.get("/api/missas/:id/musicas", async (req, res) => {
    try {
      const musicas = await storage.getMusicasByMissaId(req.params.id);
      res.json(musicas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch musicas" });
    }
  });

  app.post("/api/musicas", async (req, res) => {
    try {
      const musica = await storage.createMusica(req.body);
      res.json(musica);
    } catch (error) {
      res.status(500).json({ error: "Failed to create musica" });
    }
  });

  app.delete("/api/musicas/:id", async (req, res) => {
    try {
      await storage.deleteMusica(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete musica" });
    }
  });

  // Biblioteca de Musicas routes
  app.get("/api/biblioteca-musicas", async (req, res) => {
    try {
      const musicas = await storage.getBibliotecaMusicas();
      res.json(musicas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch biblioteca musicas" });
    }
  });

  app.post("/api/biblioteca-musicas", async (req, res) => {
    try {
      const musica = await storage.createBibliotecaMusica(req.body);
      res.json(musica);
    } catch (error) {
      res.status(500).json({ error: "Failed to create biblioteca musica" });
    }
  });

  app.delete("/api/biblioteca-musicas/:id", async (req, res) => {
    try {
      await storage.deleteBibliotecaMusica(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete biblioteca musica" });
    }
  });

  // Anotacoes routes
  app.get("/api/musicos/:id/anotacoes", async (req, res) => {
    try {
      const anotacoes = await storage.getAnotacoesByMusicoId(req.params.id);
      res.json(anotacoes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anotacoes" });
    }
  });

  app.post("/api/musicos/:id/anotacoes", async (req, res) => {
    try {
      const anotacao = await storage.createAnotacao(req.params.id, req.body.texto);
      res.json(anotacao);
    } catch (error) {
      res.status(500).json({ error: "Failed to create anotacao" });
    }
  });

  app.delete("/api/anotacoes/:id", async (req, res) => {
    try {
      await storage.deleteAnotacao(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete anotacao" });
    }
  });

  // Sugestoes routes
  app.get("/api/musicos/:id/sugestoes", async (req, res) => {
    try {
      const sugestoes = await storage.getSugestoesByMusicoId(req.params.id);
      res.json(sugestoes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sugestoes" });
    }
  });

  app.post("/api/musicos/:id/sugestoes", async (req, res) => {
    try {
      const sugestao = await storage.createSugestao(req.params.id, req.body.texto);
      res.json(sugestao);
    } catch (error) {
      res.status(500).json({ error: "Failed to create sugestao" });
    }
  });

  app.put("/api/sugestoes/:id", async (req, res) => {
    try {
      const sugestao = await storage.updateSugestaoStatus(req.params.id, req.body.status);
      res.json(sugestao);
    } catch (error) {
      res.status(500).json({ error: "Failed to update sugestao" });
    }
  });

  // Indisponibilidades routes
  app.get("/api/indisponibilidades", authenticateToken, async (req, res) => {
    try {
      const indisponibilidades = await storage.getIndisponibilidades();
      res.json(indisponibilidades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch indisponibilidades" });
    }
  });

  app.get("/api/musicos/:id/indisponibilidades", authenticateToken, async (req, res) => {
    try {
      const indisponibilidades = await storage.getIndisponibilidadesByMusicoId(req.params.id);
      res.json(indisponibilidades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch indisponibilidades" });
    }
  });

  app.post("/api/indisponibilidades", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const indisponibilidade = await storage.createIndisponibilidade(req.body);
      res.json(indisponibilidade);
    } catch (error) {
      res.status(500).json({ error: "Failed to create indisponibilidade" });
    }
  });

  app.put("/api/indisponibilidades/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const indisponibilidade = await storage.updateIndisponibilidade(req.params.id, req.body);
      res.json(indisponibilidade);
    } catch (error) {
      res.status(500).json({ error: "Failed to update indisponibilidade" });
    }
  });

  app.delete("/api/indisponibilidades/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      await storage.deleteIndisponibilidade(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete indisponibilidade" });
    }
  });

  // Music search routes
  app.get("/api/search/music", authenticateToken, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const results = await MusicSearchService.searchMusic(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search music" });
    }
  });

  app.post("/api/search/youtube-to-mp3", authenticateToken, async (req, res) => {
    try {
      const { youtubeUrl } = req.body;
      if (!youtubeUrl) {
        return res.status(400).json({ error: "YouTube URL is required" });
      }
      
      const mp3Link = MusicSearchService.generateCnvMp3Link(youtubeUrl);
      res.json({ mp3Link });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate MP3 link" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
