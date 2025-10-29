// netlify/functions/delete-memo.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: JSON.stringify({ success: false, message: '잘못된 요청 방식입니다.' }) };
    }

    const client = new Client({
        connectionString: process.env.NEON_DB_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        // 경로 변수에서 메모 ID를 추출 (예: /.netlify/functions/delete-memo/123)
        const id = event.path.split('/').pop(); 
        
        if (!id || isNaN(parseInt(id))) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: '유효한 메모 ID가 필요합니다.' }) };
        }

        await client.connect();

        // 해당 ID의 메모를 삭제합니다.
        const query = 'DELETE FROM memos WHERE id = $1;';
        const values = [parseInt(id)];
        
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return { statusCode: 404, body: JSON.stringify({ success: false, message: '삭제할 메모를 찾을 수 없습니다.' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: '메모가 성공적으로 삭제되었습니다.' }),
        };

    } catch (error) {
        console.error("DB 삭제 오류:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '메모를 DB에서 삭제하는데 실패했습니다.' }),
        };
    } finally {
        await client.end();
    }
};
