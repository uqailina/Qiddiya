//---------jana---------

console.log("script loaded!");


const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function updateClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return; 

  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}


if (document.getElementById("clock")) {
  setInterval(updateClock, 1000);
  updateClock();
}



// ---------------------------Noora----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joinForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // 

    const name = document.getElementById('name');
    const photo = document.getElementById('photo');
    const dob   = document.getElementById('dob');
    const email = document.getElementById('email');
    const expertise = document.getElementById('expertise');
    const skills    = document.getElementById('skills');
    const education = document.getElementById('education');
    const message   = document.getElementById('message');

    const fields = [name, photo, dob, email, expertise, skills, education, message];
    for (const f of fields) {
      if (!f || String(f.value).trim() === '') {
        alert('Please fill all fields.');
        f?.focus();
        return;
      }
    }

    if (/^\d/.test(name.value.trim())) {
      alert('The name field must not start with a number.');
      name.focus();
      return;
    }

    const file = photo.files[0];
    const okTypes = ['image/png','image/jpeg','image/jpg','image/webp'];
    if (!file || !okTypes.includes(file.type)) {
      alert('Photo must be an image (PNG, JPG, JPEG, or WEBP).');
      photo.focus();
      return;
    }

    const maxDob = new Date('2008-12-31');
    const userDob = new Date(dob.value);
    if (!(userDob instanceof Date) || isNaN(userDob.getTime()) || userDob > maxDob) {
      alert('DOB should not be after 2008.');
      dob.focus();
      return;
    }

alert('Thanks, ' + name.value.trim() + '! Your request has been received.');
    form.reset();
  });
});

//----------------------Shahad----------------------------

// localStorage key for provider services
const SERVICES_KEY = "providerServices";
//favorite service IDs will be stored
const FAVORITES_KEY = "favoriteServices";

// Load services array from localStorage
function loadServices() {
  const data = localStorage.getItem(SERVICES_KEY);
  if (!data) return [];
  try {
    const arr = JSON.parse(data);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

// Save services array to localStorage
function saveServices(services) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

// ========= SERVICES PAGE SORT =========

document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sortSelect");
  const serviceList = document.querySelector(".service-list");

  if (!sortSelect || !serviceList) return; 

  // Get all service cards into an array
  const cards = Array.from(serviceList.querySelectorAll(".service-card"));

  // shuffle array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  //  read data from each card 
  function getPrice(card) {
    const text = card.querySelector(".chip").textContent.trim();
    return parseFloat(text);
  }

  function getName(card) {
    return card.querySelector(".s-title").textContent.trim().toLowerCase();
  }

  // Apply sorting depending on drop down value 
  function applySort(value) {
    // Start from original cards array
    let sorted = [...cards];

    if (value === "price-asc") {
      sorted.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (value === "price-desc") {
      sorted.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (value === "name-asc") {
      sorted.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (value === "name-desc") {
      sorted.sort((a, b) => getName(b).localeCompare(getName(a)));
    }

    // Put cards back into the list in the new order
    sorted.forEach(card => serviceList.appendChild(card));
  }

  //Initial random order when page opens 
  shuffle(cards);
  cards.forEach(card => serviceList.appendChild(card));

  // When user changes sort apply sort 
  sortSelect.addEventListener("change", function () {
    applySort(this.value);
  });
});


// ========= ADD A NEW SERVICE PAGE =========

document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("svcName");
  if (!nameInput) return; 

  const form = nameInput.closest("form");
  const photoInput = document.getElementById("svcPhoto");
  const priceInput = document.getElementById("svcPrice");
  const descInput = document.getElementById("svcDesc");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const name = nameInput.value.trim();
    const priceStr = priceInput.value.trim();
    const desc = descInput.value.trim();
    const photoFile = photoInput.files[0];

    const errors = [];

    //  Required fields and pattern checks 
    if (!name) {
      errors.push("Service name is required.");
    } else if (/^[0-9]/.test(name)) {
      errors.push("Service name can't start with a number.");
    }

    if (!photoFile) {
      errors.push("Please choose a photo for the service.");
    } else if (!photoFile.type.startsWith("image/")) {
      errors.push("The photo must be an image file.");
    }

    if (!priceStr) {
      errors.push("Price is required.");
    }

    const price = Number(priceStr);
    if (priceStr && (Number.isNaN(price) || price < 0)) {
      errors.push("Price must be a valid non-negative number.");
    }

    if (!desc) {
      errors.push("Service description is required.");
    }

    // If  errors show alert and stop
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const services = loadServices();

    const newService = {
      id: Date.now(),                 
      name: name,
      price: price,
      description: desc,
     
      imageFileName: photoFile.name
    };

    services.push(newService);
    saveServices(services);

    // alert with service name
    alert("New service added successfully: " + name);

    // Clear the form
    form.reset();
  });
});


// ========= PROVIDER DASHBOARD PAGE =========


document.addEventListener("DOMContentLoaded", function () {
  const dashList = document.querySelector(".dash-list");
  if (!dashList) return; 

  dashList.innerHTML = "";

  const services = loadServices();

  if (services.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No services yet. Go to 'Add A New Service' to create one.";
    dashList.appendChild(msg);
    return;
  }

  // Create service cards from localStorage
  services.forEach(service => {
    const article = document.createElement("article");
    article.className = "dash-item";

    const thumbDiv = document.createElement("div");
    thumbDiv.className = "dash-thumb";
    const img = document.createElement("img");
    img.alt = service.name + " service";

    img.src = "images/" + (service.imageFileName || "ticket.jpg");
    thumbDiv.appendChild(img);

    // Text block
    const textDiv = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = service.name;
    const desc = document.createElement("div");
    desc.textContent = service.description;
    textDiv.appendChild(title);
    textDiv.appendChild(desc);

    // Price chip
    const priceSpan = document.createElement("span");
    priceSpan.className = "chip";
    priceSpan.textContent = service.price + " SAR";

    article.appendChild(thumbDiv);
    article.appendChild(textDiv);
    article.appendChild(priceSpan);

    dashList.appendChild(article);
  });
});

// ========= MANAGE STAFF MEMBERS PAGE =========

document.addEventListener("DOMContentLoaded", function () {
  const msGrid = document.querySelector(".ms-grid");
  if (!msGrid) return;
  const deleteBtn = document.querySelector(".ms-del .btn");

  // Add new staff form elements
  const staffNameInput = document.getElementById("name");
  const staffForm = staffNameInput ? staffNameInput.closest("form") : null;
  const dobInput = document.getElementById("dob");
  const emailInput = document.getElementById("email");
  const expertiseInput = document.getElementById("expertise");
  const skillsInput = document.getElementById("skills");
  const educationInput = document.getElementById("education");
  const photoInput = document.getElementById("photo");

  function getInitialStaff() {
    const staffArr = [];
    const rows = msGrid.querySelectorAll(".ms-row");

    rows.forEach((row, index) => {
      const nameDiv = row.querySelector("div:last-child");
      const img = row.querySelector("img");
      const name = nameDiv ? nameDiv.textContent.trim() : "Staff " + (index + 1);
      const src = img ? img.getAttribute("src") || "" : "";

      staffArr.push({
        id: Date.now() + index,
        name: name,
        imgFileName: src.replace(/^images\//, "")
      });
    });

    return staffArr;
  }

  function renderStaff(staffArr) {
    msGrid.innerHTML = "";

    staffArr.forEach(member => {
      const row = document.createElement("div");
      row.className = "ms-row";
      row.dataset.id = String(member.id);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const photoDiv = document.createElement("div");
      photoDiv.className = "ms-ph";
      const img = document.createElement("img");

      const fileName = member.imgFileName || "abdullah.jpg";
      img.src = fileName.startsWith("images/") ? fileName : "images/" + fileName;
      img.alt = member.name;
      photoDiv.appendChild(img);

      const nameDiv = document.createElement("div");
      nameDiv.textContent = member.name;

      row.appendChild(checkbox);
      row.appendChild(photoDiv);
      row.appendChild(nameDiv);

      msGrid.appendChild(row);
    });
  }

  let staffMembers = getInitialStaff();
  renderStaff(staffMembers);

  //  Delete button logic 
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const checkboxes = msGrid.querySelectorAll("input[type='checkbox']");
      const selectedIds = [];

      checkboxes.forEach(cb => {
        if (cb.checked) {
          const row = cb.closest(".ms-row");
          if (row && row.dataset.id) {
            selectedIds.push(row.dataset.id);
          }
        }
      });

      if (selectedIds.length === 0) {
        alert("Please select at least one offer");
        return;
      }

      const confirmDelete = confirm("Are you sure you want to delete the selected members?");
      if (!confirmDelete) return;

      staffMembers = staffMembers.filter(member => !selectedIds.includes(String(member.id)));
      renderStaff(staffMembers);   
    });
  }

  // ---------- Add new staff ----------
  if (staffForm) {
    staffForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = staffNameInput.value.trim();
      const dob = dobInput.value.trim();
      const email = emailInput.value.trim();
      const expertise = expertiseInput.value.trim();
      const skills = skillsInput.value.trim();
      const education = educationInput.value.trim();
      const photoFile = photoInput.files[0];

      const errors = [];

      function hasLetter(str) {
        return /[a-zA-Z]/.test(str);
      }

      if (!name) {
        errors.push("Name is required.");
      } else if (!hasLetter(name)) {
        errors.push("Name must contain at least one letter (not only numbers/symbols).");
      }

      if (!dob) {
        errors.push("Date of birth is required.");
      }

      if (!email) {
        errors.push("Email is required.");
      } else if (!email.includes("@") || !email.includes(".")) {
        errors.push("Email is not valid.");
      }

      if (!expertise) {
        errors.push("Area of expertise is required.");
      } else if (!hasLetter(expertise)) {
        errors.push("Area of expertise must contain letters (not only numbers/symbols).");
      }

      if (!skills) {
        errors.push("Skills are required.");
      }

      if (!education) {
        errors.push("Education is required.");
      }

      if (!photoFile) {
        errors.push("Photo is required.");
      } else if (!photoFile.type.startsWith("image/")) {
        errors.push("Photo must be an image file.");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const newMember = {
        id: Date.now(),
        name: name,
        imgFileName: photoFile.name,
        dob: dob,
        email: email,
        expertise: expertise,
        skills: skills,
        education: education
      };

      staffMembers.push(newMember);
      renderStaff(staffMembers);   

      alert("New staff member added: " + name);

      staffForm.reset();
    });
  }
});


// ================== FAVORITES set up hearts on Services page ==================

// Reset favorites only once per visit
if (!sessionStorage.getItem("sessionStarted")) {
  localStorage.removeItem("favoriteServices");
  sessionStorage.setItem("sessionStarted", "yes");
}

// Reset added services once per visit
if (!sessionStorage.getItem("srvSessionStarted")) {
  localStorage.removeItem(SERVICES_KEY);   
  sessionStorage.setItem("srvSessionStarted", "yes");
}

function setupServiceHearts() {
  const cards = document.querySelectorAll(".service-card");

  if (!cards.length) return;

  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

  cards.forEach(card => {
    const titleEl = card.querySelector(".s-title");
    const descEl  = card.querySelector(".s-desc");
    const priceEl = card.querySelector(".chip");
    const imgEl   = card.querySelector(".thumb img");
    const heartCb = card.querySelector(".heart input[type='checkbox']");

    if (!titleEl || !heartCb) return; 

    const name = titleEl.textContent.trim();

    const isFav = favorites.some(s => s.name === name);
    heartCb.checked = isFav;

    // When user clicks the heart checkbox
    heartCb.addEventListener("change", () => {
      if (heartCb.checked) {
        const serviceObj = {
          name: name,
          description: descEl ? descEl.textContent.trim() : "",
          price: priceEl ? priceEl.textContent.trim() : "",
          image: imgEl ? imgEl.getAttribute("src") : ""
        };
        addFavoriteService(serviceObj);
      } else {
        removeFavoriteService(name);
      }
    });
  });
}

function addFavoriteService(service) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

  if (!favorites.some(s => s.name === service.name)) {
    favorites.push(service);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

// Remove a service from favorites by name
function removeFavoriteService(name) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  favorites = favorites.filter(s => s.name !== name);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
// ================== load on Favorite Services page ==================
function loadFavoriteServices() {
  const listEl  = document.getElementById("favorites-list");
  const emptyEl = document.getElementById("empty-favorites");

  if (!listEl || !emptyEl) return;

  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

  if (!favorites.length) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";
  listEl.innerHTML = "";

  favorites.forEach(service => {

    const card = document.createElement("div");
    card.classList.add("service-card", "card");

    const thumb = document.createElement("div");
    thumb.classList.add("thumb");

    if (service.image) {
      const img = document.createElement("img");
      img.src = service.image;
      img.alt = service.name;
      thumb.appendChild(img);
    }

    const textBox = document.createElement("div");

    const title = document.createElement("h4");
    title.classList.add("s-title");
    title.textContent = service.name;

    const desc = document.createElement("p");
    desc.classList.add("s-desc");
    desc.textContent = service.description;

    textBox.appendChild(title);
    textBox.appendChild(desc);

    const priceBox = document.createElement("div");
    priceBox.classList.add("price-box");

    const chip = document.createElement("span");
    chip.classList.add("chip");
    chip.textContent = service.price;

    priceBox.appendChild(chip);

    card.appendChild(thumb);
    card.appendChild(textBox);
    card.appendChild(priceBox);

    listEl.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupServiceHearts();
  loadFavoriteServices();
});


//---------------------Norah---------------------------//

//------------------request page--------------------------//

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  if (!form) return;

  const service  = form.querySelector('select[name="service"]');
  const customer = form.querySelector('input[name="customer"]');
  const due      = form.querySelector('input[name="due"]');
  const desc     = form.querySelector('textarea[name="desc"]');

  // C display all added requests while staying on the page
  const requestsContainer = document.createElement('div');
  requestsContainer.id = 'requests-list';
  requestsContainer.className = 'requests-list';
  form.parentNode.insertBefore(requestsContainer, form.nextSibling);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errors = [];

    const serviceVal  = service.value;
    const nameVal     = customer.value.trim();
    const dueVal      = due.value;
    const descVal     = desc.value.trim();

    // --- Service selected ---
    if (!serviceVal) {
      errors.push('Service is required.');
    }

    // --- Customer full name validation ---
    if (!nameVal) {
      errors.push('Full name is required.');
    } else {
      const parts = nameVal.split(/\s+/);
      if (parts.length < 2) {
        errors.push('Please enter full name (first and last).');
      }
      if (/\d/.test(nameVal)) {
        errors.push('Name must not contain numbers.');
      }
      if (/[?!@]/.test(nameVal)) {
        errors.push('Name must not contain ?, !, or @ characters.');
      }
    }

    // --- Due date  ---
    if (!dueVal) {
      errors.push('Due date is required.');
    } else {
      const dueDate = new Date(dueVal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      //  due date must be at least 2 days from today
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 2);

      if (dueDate < minDate) {
        errors.push(' Please choose a date at least 2 days from today.');
      }
    }

    // --- Description length ---
    if (descVal.length < 100) {
      errors.push('Request description must be at least 100 characters.');
    }

    if (errors.length > 0) {
      alert('Please fix the following:\n- ' + errors.join('\n- '));
      return;
    }

    const stayOnPage = confirm(
      `Your request has been sent successfully.\n` +
      `Service: ${serviceVal}\n` +
      `Due date: ${dueVal}\n\n` +
      `Do you want to stay on this page and add more requests?\n` +
      `Press OK to stay, or Cancel to return to the dashboard.`
    );

    if (stayOnPage) {
      // keep all requests
      const card = document.createElement('div');
      card.className = 'request-card';
      card.innerHTML = `
        <h3>${serviceVal}</h3>
        <p><strong>Customer:</strong> ${nameVal}</p>
        <p><strong>Due date:</strong> ${dueVal}</p>
        <p><strong>Description:</strong> ${descVal}</p>
      `;
      requestsContainer.appendChild(card);

      // customer can add another request
      form.reset();
    } else {
      //  back to customer dashboard 
      window.location.href = 'customer-dashboard.html';
    }
  });

  //  clear all current errors on reset
  const cancelBtn = form.querySelector('.actions button[type="reset"]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
    });
  }
});




//----------------Eval Page------------------------//


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  if (!form) return;

  const serviceSelect = document.getElementById('prev-service');
  const feedback      = form.querySelector('textarea[name="feedback"]');
  const stars         = form.querySelectorAll('.star');
  let currentRating   = 0;

  function clearHighlights() {
    serviceSelect.classList.remove('error-field');
    feedback.classList.remove('error-field');
  }

  // ---- Star rating  ----
  stars.forEach((star, index) => {
    const ratingValue = index + 1;
    star.style.cursor = 'pointer';

    const setRating = () => {
      currentRating = ratingValue;
      stars.forEach((s, i) => {
        s.classList.toggle('active', i < ratingValue);
      });
    };

    star.addEventListener('click', setRating);
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setRating();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearHighlights();

    const errors = [];

    // 1) Selected service
    if (!serviceSelect.value) {
      errors.push('Please select a service.');
      serviceSelect.classList.add('error-field');
    }

    // 2) Rating
    if (currentRating === 0) {
      errors.push('Please select a rating.');
    }

    // 3) Feedback
    const feedbackText = feedback.value.trim();
    if (!feedbackText) {
      errors.push('Please enter your feedback.');
      feedback.classList.add('error-field');
    }

    if (errors.length > 0) {
      alert('Please fix the following:\n- ' + errors.join('\n- '));
      return;
    }

    // ----- check rating -----
    if (currentRating >= 4) {
      alert('Thank you for your feedback! We are glad you enjoyed this service.');
    } else {
      alert('We are sorry that your experience was not perfect. We will work hard to improve our services.');
    }

    // Move to customer dashboard 
    window.location.href = 'customer-dashboard.html';
  });

  const cancelBtn = form.querySelector('.actions button[type="reset"]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      clearHighlights();
      stars.forEach(s => s.classList.remove('active'));
      currentRating = 0;
    });
  }
});


//-------Theme-------
const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeBtn.textContent = "☀️";
  themeBtn.classList.remove("light");
  themeBtn.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeBtn.textContent = "☀️";
    themeBtn.classList.remove("light");
    themeBtn.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙";
    themeBtn.classList.remove("dark");
    themeBtn.classList.add("light");
    localStorage.removeItem("theme");
  }
});
