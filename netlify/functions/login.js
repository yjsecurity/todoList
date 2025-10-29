// netlify/functions/login.js

exports.handler = async (event, context) => {
    // 1. HTTP 요청에서 사용자 입력값(비밀번호)을 추출
    const { password } = JSON.parse(event.body);

    // 2. Netlify에 설정된 환경 변수(정답 비밀번호)를 안전하게 로드
    const correctPassword = process.env.MEMO_PASSWORD;

    // 3. 비밀번호 비교
    if (password === correctPassword) {
        // 성공 응답: 메모장 토큰(임시) 또는 성공 상태 반환
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "로그인 성공" })
        };
    } else {
        // 실패 응답: 인증 실패 상태 반환
        return {
            statusCode: 401, // Unauthorized
            body: JSON.stringify({ success: false, message: "비밀번호가 틀렸습니다." })
        };
    }
};
