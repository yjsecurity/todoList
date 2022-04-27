# 바닐라 자바스크립트 투두리스트 만들기
### 2022.04.20 ~ 2022.04.27
- 자바스크립트 토이 프로젝트
- 할일 추가, 삭제 가능한 투두리스트
<br>
<br>

## 완성된 모습
* [오늘 뭐하지?🤔](https://seoyeon-jung.github.io/todoList/)  << 페이지 클릭!
* 실제 구현 모습 <br>
  <img src="https://user-images.githubusercontent.com/95006849/165470893-e17fc0a9-bfbb-461d-b417-51118cce5cd0.gif">
<br>
<br>


## 사용한 기술 스택  
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
<br>
<br>
<br>

## 구현한 기능
- `+ 버튼` 클릭하거나 `Enter` 키를 누르면 할 일 추가
- `x 버튼`: 클릭하면 할 일 삭제
- `checkbox`: 클릭하면 할 일 완료 표시 (취소선)
- `전체선택`: 클릭하면 전체 할 일 완료 표시
- `전체삭제` 클릭하면 전체 할 일 삭제
- `전체`/ `진행중`/ `완료` : 각각 클릭하면 전체 할일 / 진행중인 할일 / 완료한 할일 따로 분리해서 보기 가능
<br>
<br>

## 오류 해결 기록
- `+ 버튼` 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165239162-254e4116-2c26-4f71-a6a6-516977ae17fb.png">
  * 해당 에러는 보통 querySelector()를 통한 HTMLElement 선택단계에서 null로 잡히는 경우이다.
  - **첫번째 삽질** : HTML이 모두 로드 되기 전에 자바스크립트 영역에서 HTML을 참조하기 때문에 `addEventListener`에서 HTML 태그를 참조할 수가 없어서 null을 참조하게 됐고 에러가 발생했다고 생각해서 <script>를 이동했으나 여전히 오류 발생
  - **두번째 삽질** : `main.js` 에서 `window.onload = function {}` 부분에 addBtn 관련 코드를 적었으나 여전히 오류
  - **`style.css` 에서 `#addBtn` 선택자로 버튼을 구현했으나, `main.js` 에서는 `.addBtn` 으로 적었기 때문에 이러한 오류가 발생했다.**
  - 따라서 `main.js`를 수정하였더니 오류가 해결되었다.
 ```javascript
 // main.js
 let addBtn = document.querySelector('#addBtn');
 ```
* * *
 - `전체보기 버튼` 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165242861-7e2b7e0d-0f41-4c78-8930-212cc63b732e.png">
    - 테이블에 잡아놓은 td 수와 불러오는 데이터 수가 맞지 않아서 나는 에러일 가능성이 있다.
    - allBtn(전체보기) function에서 `querySelector()` 이 아니라 `querySelectorAll()` 로 적어야 오류가 나지 않는다.
    - `allBtn` 인데 `addBtn` 으로 오타 적어서 오타 수정
 ```javascript
 // main.js
 addBtn.addEventListener('click', function() {
  ...
  todoList = document.querySelectorAll('.list');
  ...
 }
 ```
* * *
- `전체선택` 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165466186-d39ec4b2-ea83-48db-a989-22787527c4e7.png">
  - 가져올 html 요소의 class 이름을 틀렸다
  - 그래서 이름을 수정하니 오류가 해결되었다.
  ```javascript
  // let allSelectBtn = document.querySelector('.allSelectBtn');
  let allSelectBtn = document.querySelector('.allSelect-btn');
  ```
* * *
 - `전체삭제` 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165466712-4ef33240-77f0-4ddb-9fcf-8bc59b9c830d.png">
  - allDelete 관련 함수를 보면 삭제 버튼 클릭시 지울 곳이 `input_box`라고 적혀 있다.
   ```javascript
   allDelete.addEventListener('click', function() {

     todo_list.innerHTML = '';
     allSelectBtn.checked = false;
  });
   ```
 - 그러나 이 함수를 적용시키면 입력창까지 전부 삭제되게 된다.
 - 그래서 살펴보니 할일 입력창이 아니라 할일 입력 리스트를 받아야 하는데 처음부터 변수를 잘못 설정했던 것이다.
 - 따라서 밑의 코드처럼 변경하고 나니 오류가 해결되었다.
  ```javascript
  // let input_box = document.querySelector('.input_box');   <- 할일 입력하는 창까지 삭제
  let todo_list = document.querySelector('.todo-list');
  ```
* * *
- `+`, `Enter` 클릭시 할일이 추가되지 않는 오류 <br><img src="https://user-images.githubusercontent.com/95006849/165467733-11fe1cfd-3f2a-466b-8786-d5c9ba39fe6f.png">
  - `id` : 스타일을 지정할 때 한 가지만 지정해서 쓰는 이름 (하나의 문서에 고유한 id 하나)
  - `class` : 그룹으로 묶어서 스타일을 지정할 때 쓰는 이름 (중복 가능)
  - html  `<div id="todo-list">` 가 아니라 `<div class="todo-list">`로 변경
