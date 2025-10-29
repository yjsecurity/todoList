// main.js 상단에 추가: 로그인 Function 호출 로직

const passwordScreen = document.querySelector('#password-screen');
const secretKeyInput = document.querySelector('#secret-key');
const loginManualButton = document.querySelector('#login-manual-button');
const errorMessage = document.querySelector('#error-message');
const memoAppContainer = document.querySelector('#memo-app-container');
const todo_list = document.querySelector('.todo-list'); // 기존 투두리스트 영역

// ------------------- 핵심 로그인 함수 -------------------
async function checkPassword() {
    const enteredPassword = secretKeyInput.value;
    errorMessage.style.display = 'none'; // 에러 메시지 초기화
    
    // Netlify Function 호출
    try {
        const response = await fetch('/.netlify/functions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 사용자 입력 비밀번호를 Function으로 전송
            body: JSON.stringify({ password: enteredPassword }),
        });

        const data = await response.json();

        if (data.success) {
            // 로그인 성공: UI 변경
            passwordScreen.style.display = 'none';
            memoAppContainer.style.display = 'block';
            console.log('로그인 성공. 메모 로드를 시작합니다.');
            
            // 📌 [다음 단계 연결] 로그인 성공 후 메모 로드 함수 호출
            loadMemos(); 

        } else {
            // 로그인 실패
            errorMessage.textContent = data.message || '비밀번호가 올바르지 않습니다.';
            errorMessage.style.display = 'block';
            secretKeyInput.value = '';
        }
    } catch (error) {
        errorMessage.textContent = '인증 서버 연결 오류.';
        errorMessage.style.display = 'block';
        console.error("Function 호출 오류:", error);
    }
}

// '접속' 버튼 클릭 이벤트 리스너
loginManualButton.addEventListener('click', checkPassword);

// Enter 키 이벤트
secretKeyInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// 📌 DB에서 메모를 로드하고 화면에 표시하는 함수
async function loadMemos() {
    console.log('메모를 불러오는 중...');
    
    try {
        // [get-memos.js] Function 호출 (DB에서 데이터 가져옴)
        const response = await fetch('/.netlify/functions/get-memos');
        const data = await response.json();

        if (data.success && data.memos) {
            
            todo_list.innerHTML = ''; // 기존 목록 비우기 (UI 정리)
            
            data.memos.forEach(memo => {
                // DB 데이터를 기반으로 HTML 요소 생성
                const list = document.createElement('div');
                list.setAttribute('class', 'list');
                
                const checked = memo.is_done ? 'checked' : '';
                const textDecoration = memo.is_done ? 'line-through' : 'none';
                
                list.innerHTML = `
                    <label class="listLb" style="text-decoration: ${textDecoration};">
                        <input type="checkbox" class="todoCheck" data-id="${memo.id}" ${checked}>
                        ${memo.text}
                    </label>
                    <button class="delBtn" data-id="${memo.id}">x</button>
                `;
                todo_list.appendChild(list);
            });
            
            // 메모 로드 후 이벤트 리스너를 다시 연결해야 합니다.
            // (이 함수들은 메모를 동적으로 생성한 후 호출되어야 작동합니다.)
            checkList(); 
            delList();   
            
        } else {
            console.error('메모 로드 실패:', data.message);
        }

    } catch (error) {
        console.error("메모 로드 Function 호출 오류:", error);
    }
}
// --------------------------------------------------------

// 이 아래에 기존의 모든 main.js (투두리스트) 코드가 와야 합니다.
// ... (기존 main.js 코드)

let addBtn = document.querySelector('#addBtn');  // 추가버튼
let inputTxt = document.querySelector('.inputTxt');  // 할일 입력창
let delTodo = document.querySelectorAll('.delBtn');  // 할일삭제
let todoList = document.querySelectorAll('.list');  // 할일 리스트
let allBtn = document.querySelector('.btn-all');  // 전체보기
let doingBtn = document.querySelector('.btn-doing');  // 진행중
let doneBtn = document.querySelector('.btn-done');  // 완료
let todoCheck = document.querySelector('.todoCheck');  // 할일 체크(완료)
let allSelectBtn = document.querySelector('.allSelect-btn');  // 전체선택
let allDelete = document.querySelector('.allDelete');  // 전체삭제

// 리스트 추가 (enter)
inputTxt.addEventListener('keyup', function(e) {

    if (e.key === 'Enter') {
        addList();
    }

    checkList();
    delList();
});

// 리스트 추가2
addBtn.addEventListener('click', function() {
    
    addList();
    checkList();
    delList();
})

// inputTxt 입력창 null값 판단
async function addList() { // 📌 async 키워드 추가!

    if (inputTxt.value !== '') {
        const memoText = inputTxt.value; // 입력 내용을 변수에 저장

        // 1. Netlify Function을 호출하여 DB에 저장
        try {
            const response = await fetch('/.netlify/functions/add-memo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: memoText }),
            });
            const data = await response.json();

            if (!data.success) {
                console.error("메모 저장 실패:", data.message);
                alert("메모 저장에 실패했습니다.");
                return; // 저장 실패 시 UI 업데이트 중단
            }

            // 2. 저장 성공 시, DB ID를 포함하여 list를 출력할 <div> 요소 생성
            let list = document.createElement('div');
            list.setAttribute('class', 'list');
            
            // 📌 data-id 속성에 DB에서 받은 ID를 추가합니다!
            list.innerHTML = `<label class="listLb"><input type="checkbox" class="todoCheck" data-id="${data.id}">${memoText}</label><button class="delBtn" data-id="${data.id}">x</button>`;

            todo_list.appendChild(list);
            inputTxt.value = '';
            inputTxt.style.borderBottom = '1px solid rgb(163, 155, 155)';

            // 경고 메시지 처리 로직... (나머지는 기존과 동일)
            if (document.querySelector('.notice')) {
                addBox = document.querySelector('.inputSection');
                let notice = document.querySelector('.notice');
                addBox.removeChild(notice);
            }
            // 3. UI 업데이트 후 이벤트 리스너 다시 연결
            checkList();
            delList();
            
        } catch (error) {
            console.error("DB Function 호출 오류:", error);
            alert("서버 연결 오류로 메모 저장에 실패했습니다.");
        }
    }
    else {
        // 텍스트 미입력시 경고 메세지 출력 로직... (기존과 동일)
        let noticeEl = document.createElement('div');
        noticeEl.setAttribute('class', 'notice');
        noticeEl.innerHTML = '<span>내용을 입력해주세요</span>';

        inputTxt.style.borderBottom = '2px solid rgb(201, 65, 65)';

        if (document.querySelector('.notice')) {
            // 경고 메시지 <div>가 생성되어 있는 경우
        }
        else {
            // 경고 메세지 <div>가 생성되어있지 않은 경우 - 요소추가 (appendChild)
            addbox = document.querySelector('.inputSection');
            addbox.appendChild(noticeEl);
        }
    }
}
// 리스트 체크
function checkList() {

    // 동적으로 생성된 요소를 다시 선택합니다.
    todoCheck = document.querySelectorAll('.todoCheck');
    let listLb = document.querySelectorAll('.listLb');

    // 📌 기존 로직과 다르게, 클릭 이벤트가 발생하면 DB에 상태 업데이트 요청을 보냅니다.
    todoCheck.forEach((listEl, index) => listEl.addEventListener('click', async function() { // 📌 async 추가!
        const memoId = listEl.getAttribute('data-id');
        const isDone = listEl.checked;
        
        try {
            // Function 호출: 해당 ID의 메모 상태 업데이트
            const response = await fetch(`/.netlify/functions/update-memo`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: memoId, is_done: isDone }),
            });
            const data = await response.json();
            
            if (data.success) {
                // DB 업데이트 성공 시, 화면 텍스트 스타일 변경
                if (isDone === true) {
                    listLb[index].style.textDecoration = 'line-through';
                } else {
                    listLb[index].style.textDecoration = 'none';
                }
            } else {
                // DB 업데이트 실패 시, 체크 상태 되돌리기 및 에러 메시지
                listEl.checked = !isDone; // 체크 상태 되돌리기
                console.error("메모 상태 업데이트 실패:", data.message);
                alert("메모 상태 업데이트에 실패했습니다.");
            }
        } catch (error) {
            // 서버 연결 오류 시, 체크 상태 되돌리기
            listEl.checked = !isDone; 
            console.error("업데이트 Function 호출 오류:", error);
            alert("서버 연결 오류로 메모 상태 업데이트에 실패했습니다.");
        }

        // listCount();
    }))
}

// 리스트 삭제;
function delList() {

    // 동적으로 생성된 요소를 다시 선택합니다.
    delTodo = document.querySelectorAll('.delBtn');
    
    // 📌 기존 로직과 다르게, 클릭된 버튼에 해당하는 메모 ID를 사용하여 DB에 삭제 요청을 보냅니다.
    delTodo.forEach(delEl => delEl.addEventListener('click', async function() { // 📌 async 추가!
        const memoId = delEl.getAttribute('data-id');

        try {
            // Function 호출: 해당 ID의 메모 삭제
            const response = await fetch(`/.netlify/functions/delete-memo/${memoId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                // DB에서 성공적으로 삭제되면, 화면에서도 삭제
                delEl.closest('.list').remove();
            } else {
                console.error("메모 삭제 실패:", data.message);
                alert("메모 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 Function 호출 오류:", error);
            alert("서버 연결 오류로 메모 삭제에 실패했습니다.");
        }
    }))

    // listCount();
}

// 전체조회
allBtn.addEventListener('click', function() {

    todoList = document.querySelectorAll('.list');

    todoList.forEach(listEl => {
        listEl.style.display = '';
    });
});

// 진행중
doingBtn.addEventListener('click', function() {

    todoList = document.querySelectorAll('.list');

    for (let i = 0; i < todoCheck.length; i++) {

        if (todoCheck[i].checked === true) {
            todoList[i].style.display = 'none';
        }
        else {
            todoList[i].style.display = "";
        }
    }
});

// 완료
doneBtn.addEventListener('click', function() {

    todoList = document.querySelectorAll('.list');

    for (let i = 0; i < todoCheck.length; i++) {

        if (todoCheck[i].checked === true) {
            todoList[i].style.display = "";
        }
        else {
            todoList[i].style.display = 'none';
        }
    }
});

// 전체선택
allSelectBtn.addEventListener('click', function() {

    todoCheck = document.querySelectorAll('.todoCheck');
    listLb = document.querySelectorAll('.listLb');

    if (allSelectBtn.checked === true) {
        
        // 전체선택 클릭 시
        for (let i = 0; i < todoCheck.length; i++) {
            todoCheck[i].checked = true;
            listLb[i].style.textDecoration = 'line-through';
        }

    }
    else {
        // 전체선택 해제 시
        for (let i = 0; i < todoCheck.length; i++) {
            todoCheck[i].checked = false;
            listLb[i].style.textDecoration = "";
        }
    }
});

// 전체삭제
allDelete.addEventListener('click', function() {

    todo_list.innerHTML = '';
    allSelectBtn.checked = false;
});
