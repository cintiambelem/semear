import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());

// Função para inicializar a base de dados SQLite
async function setupDB() {
    const db = await open({
        filename: './database.sqlite', // O ficheiro será criado automaticamente aqui
        driver: sqlite3.Database
    });

    // Criar a tabela se não existir
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Modulos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            descricao TEXT,
            youtube_url TEXT
        )
    `);

    // Limpar dados antigos e inserir os links reais do YouTube
    await db.exec('DELETE FROM Modulos');
    await db.exec(`
        INSERT INTO Modulos (titulo, descricao, youtube_url) VALUES
        ('Lógica de Programação', 'Fundamentos para quem quer começar na área de tecnologia.', 'https://www.youtube.com/embed/8mei6uVttho'),
        ('Backend com Java', 'Estruturas, tipos de dados e primeiros passos no ecossistema JVM.', 'https://www.youtube.com/embed/LnORjqZUMIQ')
    `);

    return db;
}

// Inicializa a base de dados quando o servidor arranca
let dbPromise = setupDB();

// Rota que o React vai chamar para ir buscar os vídeos
app.get('/api/modulos', async (req, res) => {
    try {
        const db = await dbPromise;
        const modulos = await db.all('SELECT * FROM Modulos');
        res.json(modulos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log('✅ API a correr na porta 3001 com SQLite! Base de dados pronta.');
});