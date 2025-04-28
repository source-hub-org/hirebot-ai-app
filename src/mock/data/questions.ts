export const questions = [
  {
    id: 1,
    question: "JavaScript là ngôn ngữ lập trình thuộc loại nào?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "Compiled Language" },
      { id: "b", text: "Interpreted Language", correct: true },
      { id: "c", text: "Both Compiled & Interpreted" },
      { id: "d", text: "Neither Compiled nor Interpreted" },
    ],
  },
  {
    id: 2,
    question: "Đâu KHÔNG phải là kiểu dữ liệu nguyên thủy trong JavaScript?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "String" },
      { id: "b", text: "Number" },
      { id: "c", text: "Object", correct: true },
      { id: "d", text: "Boolean" },
    ],
  },
  {
    id: 3,
    question:
      "Phương thức nào được sử dụng để thêm một phần tử vào cuối mảng trong JavaScript?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "push()", correct: true },
      { id: "b", text: "append()" },
      { id: "c", text: "addToEnd()" },
      { id: "d", text: "insert()" },
    ],
  },
  {
    id: 4,
    question: "Cách khai báo biến nào có phạm vi block scope trong JavaScript?",
    type: "MCQ",
    language: "JavaScript",
    level: "Middle",
    options: [
      { id: "a", text: "var" },
      { id: "b", text: "let" },
      { id: "c", text: "const" },
      { id: "d", text: "Cả B và C", correct: true },
    ],
  },
  {
    id: 5,
    question:
      'Đâu là cách chính xác để kiểm tra xem "x" có phải là một đối tượng không?',
    type: "MCQ",
    language: "JavaScript",
    level: "Middle",
    options: [
      { id: "a", text: 'typeof(x) === "object"' },
      { id: "b", text: "x instanceof Object" },
      { id: "c", text: "x.constructor === Object" },
      {
        id: "d",
        text: "Tất cả đều đúng trong một số trường hợp",
        correct: true,
      },
    ],
  },
  {
    id: 6,
    question: "Closure trong JavaScript là gì?",
    type: "MCQ",
    language: "JavaScript",
    level: "Middle",
    options: [
      { id: "a", text: "Một hàm được định nghĩa bên trong một hàm khác" },
      { id: "b", text: "Một hàm có thể truy cập các biến từ hàm cha của nó" },
      {
        id: "c",
        text: "Một hàm có thể truy cập các biến từ scope bên ngoài của nó, ngay cả khi scope đó đã kết thúc",
        correct: true,
      },
      { id: "d", text: "Một cách để đóng gói dữ liệu trong JavaScript" },
    ],
  },
  {
    id: 7,
    question: "Promise trong JavaScript được sử dụng để làm gì?",
    type: "MCQ",
    language: "JavaScript",
    level: "Middle",
    options: [
      { id: "a", text: "Xử lý sự kiện DOM" },
      { id: "b", text: "Xử lý các thao tác bất đồng bộ", correct: true },
      { id: "c", text: "Tạo các hàm callback" },
      { id: "d", text: "Tối ưu hóa hiệu suất JavaScript" },
    ],
  },
  {
    id: 8,
    question:
      "Phương thức nào được sử dụng để chuyển đổi một đối tượng JavaScript thành chuỗi JSON?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "JSON.stringify()", correct: true },
      { id: "b", text: "JSON.parse()" },
      { id: "c", text: "JSON.toText()" },
      { id: "d", text: "JSON.toString()" },
    ],
  },
  {
    id: 9,
    question:
      "Trong React, hooks nào được sử dụng để lưu trữ state trong functional component?",
    type: "MCQ",
    language: "JavaScript",
    level: "Senior",
    options: [
      { id: "a", text: "useEffect()" },
      { id: "b", text: "useState()", correct: true },
      { id: "c", text: "useContext()" },
      { id: "d", text: "useReducer()" },
    ],
  },
  {
    id: 10,
    question: "Trong JavaScript, event bubbling là gì?",
    type: "MCQ",
    language: "JavaScript",
    level: "Senior",
    options: [
      {
        id: "a",
        text: "Khi một sự kiện xảy ra trên một phần tử, nó sẽ lan truyền lên các phần tử cha",
        correct: true,
      },
      {
        id: "b",
        text: "Khi một sự kiện xảy ra trên một phần tử, nó sẽ lan truyền xuống các phần tử con",
      },
      { id: "c", text: "Khi nhiều sự kiện xảy ra cùng một lúc" },
      { id: "d", text: "Khi một sự kiện bị hủy bỏ trước khi hoàn thành" },
    ],
  },
  {
    id: 11,
    question:
      "Giải thích cách hoạt động của Event Loop trong JavaScript và vai trò của nó trong mô hình bất đồng bộ.",
    type: "Essay",
    language: "JavaScript",
    level: "Senior",
  },
  {
    id: 12,
    question:
      "Phân tích ưu nhược điểm của các phương pháp quản lý state trong React (useState, useReducer, Context API, Redux). Khi nào nên sử dụng mỗi phương pháp?",
    type: "Essay",
    language: "JavaScript",
    level: "Senior",
  },
  {
    id: 13,
    question:
      "Trong Python, phương thức nào được sử dụng để sao chép một list?",
    type: "MCQ",
    language: "Python",
    level: "Junior",
    options: [
      { id: "a", text: "copy()", correct: true },
      { id: "b", text: "clone()" },
      { id: "c", text: "duplicate()" },
      { id: "d", text: "replicate()" },
    ],
  },
  {
    id: 14,
    question: "Trong Python, list comprehension được sử dụng để làm gì?",
    type: "MCQ",
    language: "Python",
    level: "Junior",
    options: [
      {
        id: "a",
        text: "Tạo một list mới từ một iterable hiện có",
        correct: true,
      },
      { id: "b", text: "Sắp xếp các phần tử trong list" },
      { id: "c", text: "Tìm kiếm các phần tử trong list" },
      { id: "d", text: "Xóa các phần tử trong list" },
    ],
  },
  {
    id: 15,
    question:
      "Phân biệt giữa shallow copy và deep copy trong Python. Cung cấp ví dụ minh họa.",
    type: "Essay",
    language: "Python",
    level: "Middle",
  },
  {
    id: 16,
    question: "Trong Java, access modifier nào hạn chế nhất?",
    type: "MCQ",
    language: "Java",
    level: "Junior",
    options: [
      { id: "a", text: "public" },
      { id: "b", text: "protected" },
      { id: "c", text: "default (no modifier)" },
      { id: "d", text: "private", correct: true },
    ],
  },
  {
    id: 17,
    question:
      "Trong C#, từ khóa nào được sử dụng để khai báo một lớp không thể kế thừa?",
    type: "MCQ",
    language: "C#",
    level: "Middle",
    options: [
      { id: "a", text: "static" },
      { id: "b", text: "sealed", correct: true },
      { id: "c", text: "abstract" },
      { id: "d", text: "virtual" },
    ],
  },
  {
    id: 18,
    question: "Trong C#, LINQ được sử dụng để làm gì?",
    type: "MCQ",
    language: "C#",
    level: "Middle",
    options: [
      {
        id: "a",
        text: "Truy vấn và thao tác dữ liệu từ các nguồn khác nhau",
        correct: true,
      },
      { id: "b", text: "Tạo giao diện người dùng" },
      { id: "c", text: "Kết nối với cơ sở dữ liệu" },
      { id: "d", text: "Xử lý ngoại lệ" },
    ],
  },
  {
    id: 19,
    question:
      "Giải thích các design pattern phổ biến trong Java và khi nào nên sử dụng chúng.",
    type: "Essay",
    language: "Java",
    level: "Senior",
  },
  {
    id: 20,
    question:
      "Phân tích ưu nhược điểm của microservices so với monolithic architecture. Khi nào nên sử dụng mỗi kiến trúc?",
    type: "Essay",
    language: "C#",
    level: "Senior",
  },
];
