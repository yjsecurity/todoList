document.addEventListener('DOMContentLoaded', () => {

    // 문서 객체 가져오기
    const input = document.querySelector('#todo');
    const todoList = document.querySelector('#todo-list');
    const addBtn = document.querySelector('#addBtn');

    // 변수 선언 (리스트 count)
    let keyCount = 0;

    // 함수 선언 (할 일 추가)
    const addTodo = () => {

        // input 칸에 내용이 없으면 경고창
        if (input.value.trim() === '') {
            alert('할 일을 입력해주세요');
            return;
        }

        // 문서 객체 설정 (할일(item), checkbox, text(할일 리스트), 버튼)
        const item = document.createElement('div');
        const checkbox = document.createElement('input');
        const text = document.createElement('span');
        const button = document.createElement('button');

        // 문서 객체를 식별할 key 생성
        const key = keyCount;
        keyCount += 1;  // 할 일 추가할때마다 증가

        // 할 일 추가시 발생하는 일 
        // (key, checkbox, 할일, 삭제버튼 추가, 할 일 리스트 생성)
        item.setAttribute('data-key', key);
        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(button);
        todoList.appendChild(item);

        // checkbox 객체 (체크하면 취소선 표시)
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            item.style.textDecoration = event.target.checked ? 'line-through' : '';
        })

        // text 객체 (할 일 입력하면 출력)
        text.textContent = input.value;

        // button 객체 (클릭하면 할 일 삭제)
        button.textContent = '삭제';
        button.addEventListener('click', () => {
            removeTodo(key);
        })

        // 입력 양식의 내용 비우기 (할일 추가하면 다시 새로고침)
        input.value = '';

    }

    // 할일 삭제 버튼 클릭시 삭제하기
    const removeTodo = (key) => {

        // 식별 키로 문서 객체 제거
        const item = document.querySelector(`[data-key = "${key}"]`);
        todoList.removeChild(item);

    }

    // 할 일 추가 (addBtn 누르기, enter키 누르기)
    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keyup', (event) => {

        // 입력 양식에서 enter 키 누르면 addTodo 호출
        const ENTER = 13;
        if (event.keyCode === ENTER) {
            addTodo();
        }
        
    })
})