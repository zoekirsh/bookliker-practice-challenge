// document.addEventListener("DOMContentLoaded", function() {});
const bookURL = 'http://localhost:3000/books'
const listPanel = document.getElementById('list-panel')
const showPanel = document.getElementById('show-panel')
let allBooks = []
const me = {id: 11, username: "zoaesis"}

getAllBooks();

//DATA
// Get

function getAllBooks() {
  fetch(bookURL)
  .then(res => res.json())
  .then(books => {
    allBooks = books
    populateList()
  })
}

function getOneBook(id) {
  fetch(bookURL+`/${id}`)
  .then(res => res.json())
  .then(book => {
    showBook(book)
  })
}

// Patch

function likeBook(book) {
  fetch(bookURL+`/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
  .then(res => res.json())
  .then(book => {
    showBook(book)
  })
  .catch(error => console.log(error.message))
}

//DOM 

function populateList() {
  allBooks.forEach(book => {
    createBook(book)
  })
}

function createBook(bookObject) {
  const li = document.createElement('li')
  li.textContent = bookObject.title
  li.id = bookObject.id
  li.addEventListener('click', handleClick)
  listPanel.appendChild(li)
}

function showBook(book) {
  showPanel.innerHTML = ""

  let container = document.createElement('div')
  let img = document.createElement('img')
  let title = document.createElement('h3')
  let subTitle = document.createElement('h3')
  let author = document.createElement('h3')
  let description = document.createElement('p')
  let likers = document.createElement('ul')
  let likeBtn = document.createElement('button')

  container.className = "container"
  img.src = book.img_url
  title.textContent = book.title
  if(book.subtitle){
    subTitle.textContent = book.subtitle
  }
  author.textContent = book.author
  description.textContent = book.description
  book.users.forEach(user => {
    let li = document.createElement('li')
    li.textContent = user.username
    likers.appendChild(li)
  })
    //like button logic
  if (book.users.find(user => user.id == me.id)) {
    likeBtn.textContent = "Remove ❤️"
  } else {
    likeBtn.textContent = "❤️"
  }
  likeBtn.addEventListener("click", () => handleLike(book))

  container.append(img, title, subTitle, author, description, likers, likeBtn)
  showPanel.appendChild(container)
}


// HANDLERS
function handleClick(e) {
  getOneBook(e.target.id)
}

function handleLike(book) {
  if (book.users.find(user => user.id == me.id)) {
    book.users.pop()
  } else {
    book.users.push(me)
  }

  likeBook(book)
}