let addBtn = document.querySelector('#addBtn');  // 추가버튼
let inputTxt = document.querySelector('.inputTxt');  // 할일 입력창
let input_box = document.querySelector('.input_box');  // 할일입력칸
let delTodo = document.querySelectorAll('.delBtn');  // 할일삭제
let todoList = document.querySelectorAll('.list');  // 할일 리스트
let allBtn = document.querySelector('.btn-all');  // 전체보기
let doingBtn = document.querySelector('.btn-doing');  // 진행중
let doneBtn = document.querySelector('.btn-done');  // 완료
let todoCheck = document.querySelector('.todoCheck');  // 할일 체크(완료)

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

        input_box.appendChild(list);
        inputTxt.value = '';
        inputTxt.getElementsByClassName.borderBottom = '1px solid rgb(163, 155, 155)';

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
addBtn.addEventListener('click', function() {

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