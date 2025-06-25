import { db } from './db';
import { authUsers } from '../shared/authSchema';
import { hashPassword } from './auth';
import { eq } from 'drizzle-orm';

// Script para criar dados iniciais se necessário
export async function seedDatabase() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.tipo, 'admin'))
      .limit(1);

    if (existingAdmin.length === 0) {
      // Criar o primeiro admin
      const adminPassword = 'admin123';
      const hashedPassword = await hashPassword(adminPassword);

      await db
        .insert(authUsers)
        .values({
          email: 'admin@paroquiaboaviagem.com',
          password: hashedPassword,
          nome: 'Administrador',
          tipo: 'admin',
          ativo: true
        });

      console.log('✅ Administrador inicial criado:');
      console.log('📧 Email: admin@paroquiaboaviagem.com');
      console.log('🔑 Senha: admin123');
      console.log('⚠️  IMPORTANTE: Altere esta senha após o primeiro login!');
    }

    // Criar usuário músico de exemplo se não existir
    const existingMusico = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.tipo, 'musico'))
      .limit(1);

    if (existingMusico.length === 0) {
      const musicoPassword = 'musico123';
      const hashedPassword = await hashPassword(musicoPassword);

      await db
        .insert(authUsers)
        .values({
          email: 'musico@paroquiaboaviagem.com',
          password: hashedPassword,
          nome: 'Músico Exemplo',
          tipo: 'musico',
          instrumento: 'Violão',
          telefone: '(31) 99999-9999',
          ativo: true
        });

      console.log('✅ Músico exemplo criado:');
      console.log('📧 Email: musico@paroquiaboaviagem.com');
      console.log('🔑 Senha: musico123');
    }

  } catch (error) {
    console.error('❌ Erro ao criar dados iniciais:', error);
  }
}