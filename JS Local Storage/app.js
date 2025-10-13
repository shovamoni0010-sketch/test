
var newMemberAddBtn = document.querySelector('.addMemberBtn'),
  darkBg = document.querySelector('.dark_bg'),
  popupForm = document.querySelector('.popup'),
  crossBtn = document.querySelector('.closeBtn'),
  submitBtn = document.querySelector('.submitBtn'),
  modalTitle = document.querySelector('.modalTitle'),
  popupFooter = document.querySelector('.popupFooter'),
  imgInput = document.querySelector('.img'),
  uploadimg = document.querySelector("uploading"),
  fName = document.getElementById("fName"),
  lName = document.getElementById("lName"),
  age = document.getElementById("age"),
  city = document.getElementById("city"),
  position = document.getElementById("position"),
  salary = document.getElementById("salary"), 
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  entries = document.querySelector(".showEntries"),
  paginationBtns = document.querySelectorAll('.pagination button'),
  tabSize = document.getElementById("table_size")
  




var originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : []
let getData = [...originalData]

let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()



newMemberAddBtn.addEventListener('click', () => {
  submitBtn.innerHTML = "Submit"
  modalTitle.innerHTML = "Fill the Form"
  popupFooter.style.display = "block"
  imgInput.src = "./img/pic1.png"
  darkBg.classList.add('active')
  popupForm.classList.add('active')
})

crossBtn.addEventListener('click', () => {

})

uploadimg.onchange = function () {
  if (uploadimg.files[0].size < 1000000) {
    var fileReader = new FileReader()

    fileReader.onload = function (e) {
      var imgUrl = e.target.result
      imgInput.src = imgUrl
    }
    fileReader.readAsDataURL(uploadimg.files[0])
  }

  else {
    alert("This file is too large!")
  }
}

function preLoadCalculations() {
  array = getData
  arrayLength = array.length
  maxIndex = arrayLength / tableSize

  if ((arrayLength % tableSize) > 0) {
    maxIndex++
  }
}



function displayIndexBtn() {
  preLoadCalculations()

  const pagination = document.querySelector('.pagination')
  pagination.innerHTML = ""

  pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

  for (let i = 1; i < maxIndex; i++){
    pagination.innerHTML += '<button onclick="pagination('+i+') index="'+i+'">"+i+"</button>'
  }

  pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

  highlightIndexBtn()
}

function highlightIndexBtn() {
  startIndex = ((currentIndex - 1) * tableSize) + 1
  endIndex = (startIndex + tableSize) - 1

  if (endIndex > arrayLength) {
    endIndex = arrayLength
  }

  if (maxIndex >= 2) {
    var nextBtn = document.querySelector(".next")
    nextBtn.classList.add("act")
  }

  entries.textContent = 'Showing ${startIndex} to ${endIndex} of ${arrayLength} entries'

  paginationBtns.forEach(btn => {
    btn.classList.remove('active')
    if (btn.getAttribute('índex') === currentIndex.toString()) {
      btn.classList.add('active')
    }

    showInfo()
      
  })


}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const information = {
    id: Date.now(),
    picture: imgInput.scr == undefined ? "./img/pic1.png" : imgInput.src,
    fName: fName.value,
    lName: lName.value,
    ageVal: age.value,
    positionVal: position.value,
    salaryVal: salary.value,
    sDateval: sDate.value,
    phoneval: phone.value
  }
  if (!isEdit) {
    originalData.unshift(information)
  }
  else {
    originalData[editId] = information
  }
  getData = [...originalData]
  localStorage.setItem('userProfile', JSON.stringify(originalData))
  
  submitBtn.innerHTML = "Submit"
  modalTitle.innerHTML = "Fill the Form"

  darkBg.classList.remove('active')
  popupForm.classList.remove('active')
  form.reset() 

  highlightIndexBtn()
  displayIndexBtn()
  showInfo()

  var nextBtn = document.querySelector(".next")
  var prevBtn = document.querySelector(".prev");  
  if (Math.floor(maxIndex) > currentIndex) {
    nextBtn.classList.add("act")
  }
  else {
    nextBtn.classList.remove("act")
  }

  if (currentIndex > 1) {
    prev.classList.add("act")
  }


})

function next() {
  var prevBtn = document.querySelector('.prev')
  var nextBtn = document.querySelector('.next')

  if (currentIndex <= maxIndex - 1) {
    currentIndex++
    prevBtn.classList.add("act")

    highlightIndexBtn()
  }

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act")
  }
}

function prev() {
  var prevBtn = document.querySelector('.prev')
  if (currentIndex > 1) {
    currentIndex--
    prevBtn.classList.add("act")
    highlightIndexBtn()
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act")
  }
}

function paginationBtn(i) {
  currentIndex = i

  var prevBtn = document.querySelector('.prev')
  var nextBtn = document.querySelector('.next')

  highlightIndexBtn()

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove('acts')
  }
  else {
    nextBtn.classList.add("act")
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act")
  }

  if (currentIndex > 1) {
    prevBtn.classList.remove('act');
  }  
}

tableSize.addEventListener('change', () => {
  var selectedValue = parseInt(tabSize.value)
  tableSize = selectedValue
  currentIndex = 1
  startIndex
})


displayIndexBtn()


