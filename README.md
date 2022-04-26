# 바닐라 자바스크립트 투두리스트 만들기
### 2022.04.20 ~ (진행중)
- 자바스크립트 토이 프로젝트
- 할일 추가, 삭제 가능한 투두리스트
- 캘린더와 연결해서 다이어리 계획 중
<br>
<br>

## 페이지 보러가기
[오늘 뭐하지?🤔](https://seoyeon-jung.github.io/todoList/)
<br>
<br>

## 사용한 기술 스택
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html&logoColor=#E34F26"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS&logoColor=#1572B6"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=html&logoColor=#F7DF1E">
<br>
<br>
<br>

## 구현할 기능
- <strong>+버튼, Enter키</strong> : + 버튼 클릭하거나 Enter 키를 누르면 할 일 추가
- <strong>삭제 버튼</strong> 누르면 할 일 삭제
- <strong>checkbox</strong> 클릭하면 할 일 완료 표시
- <strong>전체선택/전체삭제</strong> : 버튼을 누르면 전체 선택되고, 전체 삭제할 수 있다.
- <strong>전체보기/진행중/완료</strong> : 작성한 목록을 count 해서 진행중과 완료중을 나눠서 볼 수 있게 한다.
- <strong>CSS 개선</strong> : 메모장처럼 디자인 바꾸기
<br>
<br>

## 진행중 (22.04.26 기준)
- 전체/진행중/완료 버튼 활성화
- 전체선택/전체삭태 버튼 필요
- 작성한 목록 count 필요
<br>
<br>

## 오류 해결 기록
- [+] 버튼 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165239162-254e4116-2c26-4f71-a6a6-516977ae17fb.png">
  * 해당 에러는 보통 querySelector()를 통한 HTMLElement 선택단계에서 null로 잡히는 경우이다.
  - **첫번째 삽질** : HTML이 모두 로드 되기 전에 자바스크립트 영역에서 HTML을 참조하기 때문에 `addEventListener`에서 HTML 태그를 참조할 수가 없어서 null을 참조하게 됐고 에러가 발생했다고 생각해서 <script>를 이동했으나 여전히 오류 발생
  - **두번째 삽질** : `main.js` 에서 `window.onload = function {}` 부분에 addBtn 관련 코드를 적었으나 여전히 오류
  - **`style.css` 에서 `#addBtn` 선택자로 버튼을 구현했으나, `main.js` 에서는 `.addBtn` 으로 적었기 때문에 이러한 오류가 발생했다.**
  - 따라서 `main.js`를 수정하였더니 오류가 해결되었다.
 
 - [전체보기] 버튼 클릭시 발생했던 오류<br><img src="https://user-images.githubusercontent.com/95006849/165242861-7e2b7e0d-0f41-4c78-8930-212cc63b732e.png">
    - 테이블에 잡아놓은 td 수와 불러오는 데이터 수가 맞지 않아서 나는 에러일 가능성이 있다.
    - allBtn(전체보기) function에서 `querySelector()` 이 아니라 `querySelectorAll()` 로 적어야 오류가 나지 않는다.
