import { pgTable, text, serial, integer, boolean, uuid, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const musicos = pgTable("musicos", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  funcao: text("funcao").notNull(),
  disponivel: boolean("disponivel").notNull().default(true),
  email: text("email"),
  telefone: text("telefone"),
  foto: text("foto"),
  observacoes_permanentes: text("observacoes_permanentes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const musicoAnotacoes = pgTable("musico_anotacoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  musico_id: uuid("musico_id").references(() => musicos.id, { onDelete: "cascade" }).notNull(),
  texto: text("texto").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const musicoSugestoes = pgTable("musico_sugestoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  musico_id: uuid("musico_id").references(() => musicos.id, { onDelete: "cascade" }).notNull(),
  texto: text("texto").notNull(),
  status: text("status").notNull().default("pendente"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const missas = pgTable("missas", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: date("data").notNull(),
  horario: time("horario").notNull(),
  tipo: text("tipo").notNull(),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const missaMusicos = pgTable("missa_musicos", {
  id: uuid("id").defaultRandom().primaryKey(),
  missa_id: uuid("missa_id").references(() => missas.id, { onDelete: "cascade" }).notNull(),
  musico_id: uuid("musico_id").references(() => musicos.id, { onDelete: "cascade" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const musicas = pgTable("musicas", {
  id: uuid("id").defaultRandom().primaryKey(),
  missa_id: uuid("missa_id").references(() => missas.id, { onDelete: "cascade" }).notNull(),
  nome: text("nome").notNull(),
  cantor: text("cantor"),
  link_youtube: text("link_youtube"),
  partitura: text("partitura"),
  link_download: text("link_download"),
  secao_liturgica: text("secao_liturgica").notNull(),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bibliotecaMusicas = pgTable("biblioteca_musicas", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  cantor: text("cantor"),
  link_youtube: text("link_youtube"),
  partitura: text("partitura"),
  link_download: text("link_download"),
  secao_liturgica: text("secao_liturgica"),
  observacoes: text("observacoes"),
  youtube_video_id: text("youtube_video_id"),
  thumbnail: text("thumbnail"),
  duracao: text("duracao"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMusicoSchema = createInsertSchema(musicos);
export const insertMissaSchema = createInsertSchema(missas);
export const insertMusicaSchema = createInsertSchema(musicas);
export const insertBibliotecaMusicaSchema = createInsertSchema(bibliotecaMusicas);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Musico = typeof musicos.$inferSelect;
export type InsertMusico = z.infer<typeof insertMusicoSchema>;
export type Missa = typeof missas.$inferSelect;
export type InsertMissa = z.infer<typeof insertMissaSchema>;
export type Musica = typeof musicas.$inferSelect;
export type InsertMusica = z.infer<typeof insertMusicaSchema>;
export type BibliotecaMusica = typeof bibliotecaMusicas.$inferSelect;
export type InsertBibliotecaMusica = z.infer<typeof insertBibliotecaMusicaSchema>;
