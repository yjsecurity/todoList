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
// --------------------------------------------------------

// 이 아래에 기존의 모든 main.js (투두리스트) 코드가 와야 합니다.
// ... (기존 main.js 코드)

let addBtn = document.querySelector('#addBtn');  // 추가버튼
let inputTxt = document.querySelector('.inputTxt');  // 할일 입력창
let todo_list = document.querySelector('.todo-list');  // 할일입력칸
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
function addList() {

    if (inputTxt.value !== '') {

        // list를 출력할 <div> 요소 생성
        let list = document.createElement('div');
        list.setAttribute('class', 'list');
        list.innerHTML = `<label class="listLb"><input type="checkbox" class="todoCheck">${inputTxt.value}</label><button class="delBtn">x</button>`;

        todo_list.appendChild(list);
        inputTxt.value = '';
        inputTxt.style.borderBottom = '1px solid rgb(163, 155, 155)';

        if (document.querySelector('.notice')) {
            
            // 경고메세지 <div>가 생성되는 경우 - 요소 삭제(removeChild)
            addBox = document.querySelector('.inputSection');
            let notice = document.querySelector('.notice');
            addBox.removeChild(notice);
        }
        else {
            // 경고 메시지 <div>가 생성되어있지 않은 경우
        }
    }
    else {

        // 텍스트 미입력시 경고 메세지 출력할 <div> 요소 생성
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

    todoCheck = document.querySelectorAll('.todoCheck');
    let listLb = document.querySelectorAll('.listLb');

    todoCheck.forEach((listEl, index) => listEl.addEventListener('click', function() {

        if (listEl.checked === true) {
            listLb[index].style.textDecoration = 'line-through';
        }
        else {
            listLb[index].style.textDecoration = 'none';
        }

        // listCount();
    }))
}

// 리스트 삭제;
function delList() {

    delTodo = document.querySelectorAll('.delBtn');
    todoList = document.querySelectorAll('.list');

    delTodo.forEach((delEl, index) => delEl.addEventListener('click', function() {

        todoList[index].remove();
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
