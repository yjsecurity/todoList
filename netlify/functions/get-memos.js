// netlify/functions/get-memos.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
    const client = new Client({
        connectionString: process.env.NEON_DB_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();

        // 🚨 이 코드가 "memos" 테이블이 없으면 생성해 줍니다!
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS memos (
                id SERIAL PRIMARY KEY,
                text VARCHAR(255) NOT NULL,
                is_done BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await client.query(createTableQuery);

        // 메모 불러오기 (Read)
        const query = 'SELECT id, text, is_done FROM memos ORDER BY created_at DESC;';
        const result = await client.query(query);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ success: true, memos: result.rows }),
        };

    } catch (error) {
        console.error("DB 로드 오류:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'DB에서 메모를 불러오는데 실패했습니다.' }),
        };
    } finally {
        await client.end();
    }
};
