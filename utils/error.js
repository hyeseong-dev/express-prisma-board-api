// 자바스크립트 자체 내장 에러 클래스 Error의 '슈도 코드'
class Error {
  constructor(message) {
    this.message = message;
    this.name = "error"; // (name은 내장 에러 클래스마다 다릅니다.)
  }
}


class NotFoundError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "resource not found"; // (2)
    this.code = 404
  }
}

export { NotFoundError }