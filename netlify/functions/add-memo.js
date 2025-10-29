// netlify/functions/add-memo.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
    // POST 요청이 아니거나 body가 없으면 거부
    if (event.httpMethod !== 'POST' || !event.body) {
        return { statusCode: 405, body: JSON.stringify({ success: false, message: '잘못된 요청 방식입니다.' }) };
    }

    const client = new Client({
        connectionString: process.env.NEON_DB_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const { text } = JSON.parse(event.body);

        if (!text) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: '메모 내용이 비어있습니다.' }) };
        }

        await client.connect();

        // 텍스트와 완료 상태(기본값 FALSE)를 DB에 삽입합니다.
        const query = 'INSERT INTO memos(text, is_done) VALUES($1, $2) RETURNING id;';
        const values = [text, false];
        
        const result = await client.query(query, values);
        const newId = result.rows[0].id; // 새로 삽입된 메모의 ID를 반환

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: '메모가 성공적으로 저장되었습니다.', id: newId }),
        };

    } catch (error) {
        console.error("DB 저장 오류:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '메모를 DB에 저장하는데 실패했습니다.' }),
        };
    } finally {
        await client.end();
    }
};
