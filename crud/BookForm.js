// import * as ELEMENTS from './elements.js'
var datepicker;
var editForm = false;

const domContentLoaded = () => {
  const elem = document.querySelector(".datepicker_input");
  datepicker = new Datepicker(elem, {
    autohide: true,
    maxDate: getYesterdayDate(),
  });
  let urlString = window.location.href;

  const paramString = urlString.split("?")[1];
  const queryString = new URLSearchParams(paramString);
  if (queryString.has("bookId")) {
    console.log(queryString.get("bookId"));
    fetchData(queryString.get("bookId"));
    editForm = true;
  }
}

const fieldValidation = (fieldName, fieldAlert, pattern) => {
  const fName = document.getElementById(fieldName);
  const fAlert = document.getElementById(fieldAlert);
  patternValidation(fName, fAlert, pattern);
}

const patternValidation = (fieldName, fieldAlert, pattern) => {
  if (pattern.test(fieldName.value)) {
    fieldName.classList.remove("error-control");
    fieldAlert.style.display = "none";
    return true;
  } else {
    fieldName.classList.add("error-control");
    fieldAlert.style.display = "block";
    return false;
  }
}

const radioValidation = (fieldName, fieldAlert, event) => {
  if(event) {
    var fieldValidate = document.querySelector('input[name="'+fieldName+'"]:checked');
    const fAlert = document.getElementById(fieldAlert);
    if (fieldValidate !== null) {
      fAlert.style.display = "none";
      return true;
    } else {
      fAlert.style.display = "block";
      return false;
    }
  } else {
    if (fieldName !== null) {
      fieldAlert.style.display = "none";
      return true;
    } else {
      fieldAlert.style.display = "block";
      return false;
    }
  }
}

const getYesterdayDate = () => {
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const dd = String(yesterday.getDate()).padStart(2, "0");
  const mm = String(yesterday.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = yesterday.getFullYear();
  const returnFormat = mm + "/" + dd + "/" + yyyy;
  return returnFormat;
}

const dateToTimestamp = (getDate) => {
  const myDate = getDate.split("/");
  var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
  return newDate.getTime();
}

document.addEventListener("DOMContentLoaded", domContentLoaded);

const fetchData = (recordId) => {
  fetch(
    `https://react-18851-default-rtdb.firebaseio.com/onlineportal-book/${recordId}.json`
  )
    .then((response) => response.json())
    .then((data) => {
      populateData(data);
    });
}

const populateData = (data) => {
  const bookName = document.getElementById("bookName");
  const publisher = document.getElementById("publisher");
  const author = document.getElementById("author");
  const authorEmail = document.getElementById("authorEmail");
  const description = document.getElementById("description");
  const price = document.getElementById("price");
  const launchedDate = document.getElementById("launchedDate");
  console.log("**** type ", data)
  bookName.value = data.name;
  publisher.value = data.publisher;
  author.value = data.author;
  authorEmail.value = data.email;
  description.value = data.description;
  price.value = data.price;
  document.getElementById(data.gender).checked = true;
  const setNewDate = Datepicker.formatDate(data.launchedDate, "mm/dd/yyyy");
  datepicker.setDate(setNewDate);
}

const validateform = (e) => {
  e.preventDefault();
  const bookName = document.getElementById("bookName");
  const publisher = document.getElementById("publisher");
  const author = document.getElementById("author");
  const authorEmail = document.getElementById("authorEmail");
  const description = document.getElementById("description");
  const price = document.getElementById("price");
  const launchedDate = document.getElementById("launchedDate");
  const gender = document.querySelector('input[name="gender"]:checked');

  const alertName = document.getElementById("alertBookName");
  const alertPublisher = document.getElementById("alertPublisher");
  const alertauthorName = document.getElementById("alertAuthorName");
  const alertAuthorEmail = document.getElementById("alertAuthorEmail");
  const alertDescription = document.getElementById("alertDescription");
  const alertPrice = document.getElementById("alertPrice");
  const alertLaunchedDate = document.getElementById("alertLaunchedDate");
  const alertGender = document.getElementById("alertGender");

  const bookNameValidate = patternValidation(
    bookName,
    alertName,
    /[a-zA-Z]{5,}/
  );
  const publisherValidate = patternValidation(
    publisher,
    alertPublisher,
    /[a-zA-Z]{5,}/
  );
  const authorValidate = patternValidation(
    author,
    alertauthorName,
    /[a-zA-Z]{5,}/
  );
  const authorEmailValidate = patternValidation(
    authorEmail,
    alertAuthorEmail,
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
  const descriptionValidate = patternValidation(
    description,
    alertDescription,
    /[a-zA-Z\s]{20,}/
  );
  const priceValidate = patternValidation(price, alertPrice, /[0-9]{1,}/);
  const launchedDateValidate = patternValidation(
    launchedDate,
    alertLaunchedDate,
    /[0-9]{1,}/
  );
  const genderValidate = radioValidation(gender, alertGender);
  if (
    bookNameValidate &&
    publisherValidate &&
    authorValidate &&
    authorEmailValidate &&
    descriptionValidate &&
    priceValidate &&
    genderValidate &&
    launchedDateValidate
  ) {
    const launchedTimeStamp = dateToTimestamp(launchedDate.value);
    const postData = {
      id: Math.random(),
      name: bookName.value,
      author: author.value,
      publisher: publisher.value,
      email: authorEmail.value,
      description: description.value,
      price: price.value,
      gender: gender.value,
      launchedDate: launchedTimeStamp,
    };
    if (editForm) {
      let urlString = window.location.href;
      console.log(urlString);
      let paramString = urlString.split("?")[1];
      let queryString = new URLSearchParams(paramString);
      fetchAPI("PUT", postData, queryString.get("bookId"));
    } else {
      fetchAPI("POST", postData);
    }
  }
}

const testValidation = () => {
aconsole.log("TEST");
}
document.getElementById("bookForm").addEventListener("submit", validateform);
// document.getElementsByClassName("form-control").addEventListener("input", testValidation);

const fetchAPI = async(method, requestData, id) => {
  let URL = "",
    successMessage = "";
  const heading = document.getElementById("heading");
  if (id) {
    URL = `https://react-18851-default-rtdb.firebaseio.com/onlineportal-book/${id}.json`;
    successMessage = "Record has been updated Successfully";
  } else {
    URL =
      "https://react-18851-default-rtdb.firebaseio.com/onlineportal-book.json";
    successMessage = "Record has been created Successfully";
  }
  const response = await fetch(URL, {
    method: method,
    body: JSON.stringify(requestData),
  });
  if (response.ok) {
    heading.insertAdjacentHTML(
      "afterend",
      '<div class="alert alert-success" role="alert">' +
        successMessage +
        "</div>"
    );
  }
  setTimeout(() => {
    window.location.href = "BookList.html";
  }, 2000);
}

window.fieldValidation = fieldValidation;
window.radioValidation = radioValidation;