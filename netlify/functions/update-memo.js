// netlify/functions/update-memo.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'PUT' || !event.body) {
        return { statusCode: 405, body: JSON.stringify({ success: false, message: '잘못된 요청 방식입니다.' }) };
    }

    const client = new Client({
        connectionString: process.env.NEON_DB_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const { id, is_done } = JSON.parse(event.body);

        if (!id || typeof is_done !== 'boolean') {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: '유효한 ID와 완료 상태가 필요합니다.' }) };
        }

        await client.connect();

        // 해당 ID의 메모의 is_done 필드를 업데이트합니다.
        const query = 'UPDATE memos SET is_done = $1 WHERE id = $2;';
        const values = [is_done, id];
        
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return { statusCode: 404, body: JSON.stringify({ success: false, message: '수정할 메모를 찾을 수 없습니다.' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: '메모 상태가 성공적으로 업데이트되었습니다.' }),
        };

    } catch (error) {
        console.error("DB 업데이트 오류:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '메모 상태를 업데이트하는데 실패했습니다.' }),
        };
    } finally {
        await client.end();
    }
};
