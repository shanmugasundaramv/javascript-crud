var bookRecords = [];
var tableBody = "";

const getRecords = async () => {
  const response = await fetch(
    "https://react-18851-default-rtdb.firebaseio.com/onlineportal-book.json"
  );
  const jsonResponse = await response.json();
  for (const key in jsonResponse) {
    bookRecords.push({
      id: key,
      name: jsonResponse[key].name,
      author: jsonResponse[key].author,
      publisher: jsonResponse[key].publisher
    });
  }
  tableBody = document.getElementById("bookList");
  let getContent = await getBookList(bookRecords);
  tableBody.innerHTML = getContent;
  document.getElementById("spinnerContainer").classList.add("d-none");
  document.getElementById("bookTable").classList.remove("d-none");
  document.getElementById("searchContainer").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", getRecords);

document.addEventListener("click", function(event) {
  var modal = document.getElementById('open-modal');
  var closeModal = document.getElementById('close-modal');
  console.log(event.target)
  if(event.target == modal || event.target == closeModal) {
    document.getElementById("open-modal").style.visibility = "hidden";
  }
})

const searchBook = async (key) => {
    if(key.length > 3) {
      const filteredRecords = bookRecords.filter(record => {
        return record.name.includes(key)
      });
      let getContent = await getBookList(filteredRecords);
      tableBody.innerHTML = getContent;
    } else {
      let getContent = await getBookList(bookRecords);
      tableBody.innerHTML = getContent;
    }
}

const getBookList = (jsonResponse) => {
  console.log('****** ', jsonResponse);
  let bodycontent = "";
  for (let record in jsonResponse) {
    let currentRecord =
      "<tr><td>" +
      jsonResponse[record].name +
      "</td><td>" +
      jsonResponse[record].author +
      "</td><td>" +
      jsonResponse[record].publisher +
      "</td><td><button id=" +
      jsonResponse[record].id +
      " class='btn btn-outline-danger btn-sm' onclick='DeleteCurrentRecord(this.id)'>Delete</button><a class='btn btn-outline-primary btn-sm' href='bookForm.html?bookId=" +
      jsonResponse[record].id +
      "'>Update</a><button id=" +
      jsonResponse[record].id +
      " class='btn btn-outline-success btn-sm' onclick='viewCurrentRecord(this.id)'>View</button></td></tr>";
    bodycontent += currentRecord;
  }
  return bodycontent;
}

const DeleteCurrentRecord = (currentId) => {
  console.log(currentId);
  fetch(
    `https://react-18851-default-rtdb.firebaseio.com/onlineportal-book/${currentId}.json`,
    { method: "DELETE" }
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
}

const UpdateCurrentRecord = (currentId) => {
  console.log(currentId);
  fetch(
    `https://react-18851-default-rtdb.firebaseio.com/onlineportal-book/${currentId}.json`,
    { method: "PUT" }
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
}

const viewCurrentRecord = (currentId) => {
  console.log(currentId);
  let output = "";
  let modalContent = document.getElementById("modalContent");
  fetch(`https://react-18851-default-rtdb.firebaseio.com/onlineportal-book/${currentId}.json`)
    .then((response) => response.json())
    .then((data) => {
      output = `<div class="row"><div class="col-4">Book</div><div class="col-8">${data.name}</div></div>
      <div class="row"><div class="col-4">Author</div><div class="col-8">${data.author}</div></div>
      <div class="row"><div class="col-4">Author Email</div><div class="col-8">${data.email}</div></div>
      <div class="row"><div class="col-4">Publisher</div><div class="col-8">${data.publisher}</div></div>
      <div class="row"><div class="col-4">Description</div><div class="col-8">${data.description}</div></div>
      <div class="row"><div class="col-4">Price</div><div class="col-8">${data.price}</div></div>
      <div class="row"><div class="col-4">Launched Date</div><div class="col-8">${data.launchedDate}</div></div>`
      modalContent.innerHTML = output;
      document.getElementById("open-modal").style.visibility = "visible";
    });
}

