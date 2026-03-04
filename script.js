<script>
const marketSelect = document.getElementById("market");
const amountField = document.getElementById("amount");
const bookingIdSpan = document.getElementById("bookingId");
const notification = document.getElementById("notification");
const bookingHistory = document.getElementById("bookingHistory");

// ============================
// LOCAL STORAGE FUNCTIONS
// ============================

function saveBookings(bookings) {
  localStorage.setItem("bookingData", JSON.stringify(bookings));
}

function loadBookings() {
  const data = localStorage.getItem("bookingData");
  return data ? JSON.parse(data) : [];
}

// ============================
// GENERATE BOOKING ID
// ============================

function generateBookingID() {
  return "SMB" + Date.now().toString().slice(-6);
}

bookingIdSpan.innerText = generateBookingID();

// ============================
// LIVE DATE & TIME
// ============================

setInterval(() => {
  const now = new Date();
  document.getElementById("dateTime").innerText =
    now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}, 1000);

// ============================
// UPDATE AMOUNT
// ============================

marketSelect.addEventListener("change", () => {
  const selectedOption = marketSelect.options[marketSelect.selectedIndex];
  const amount = selectedOption.value;
  amountField.value = amount ? `₹${amount}` : "";
});

// ============================
// NOTIFICATION
// ============================

function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  setTimeout(() => notification.classList.remove("show"), 3000);
}

// ============================
// FORMAT PHONE
// ============================

function formatPhoneNumber(phone) {
  return phone.length > 4 ? "****" + phone.slice(-4) : phone;
}

// ============================
// RENDER BOOKINGS
// ============================

function renderBookings() {
  const bookings = loadBookings();
  bookingHistory.innerHTML = "";

  bookings.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className =
      "history-item p-3 bg-white rounded-lg flex justify-between items-center";

    historyItem.innerHTML = `
      <div>
        <div class="font-medium">${item.id}</div>
        <div class="text-xs text-gray-500">${item.market}</div>
        <div class="text-xs text-gray-500">Phone: ${item.phone}</div>
      </div>
      <div class="text-right">
        <div class="text-xs font-medium">${item.date}</div>
        <div class="text-xs text-gray-500">${item.time}</div>
      </div>
    `;

    bookingHistory.appendChild(historyItem);
  });
}

// ============================
// FORM SUBMIT
// ============================

document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const marketText =
    marketSelect.options[marketSelect.selectedIndex].text;
  const marketValue = marketSelect.value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const state = document.getElementById("state").value;

  if (!marketValue || !name || !phone || !state) {
    showNotification("Please complete all details.", "error");
    return;
  }

  const bookingID = generateBookingID();
  const formattedPhone = formatPhoneNumber(phone);

  // Receipt
  document.getElementById("receiptId").innerText = bookingID;
  document.getElementById("receiptDateTime").innerText =
    document.getElementById("dateTime").innerText;
  document.getElementById("receiptName").innerText = name;
  document.getElementById("receiptPhone").innerText = formattedPhone;
  document.getElementById("receiptState").innerText = state;
  document.getElementById("receiptMarket").innerText = marketText;
  document.getElementById("receiptAmount").innerText = `₹${marketValue}`;
  document.getElementById("receiptUPI").innerText =
    document.getElementById("upiText").innerText;

  document.getElementById("receipt").classList.remove("hidden");

  // Save to localStorage
  let bookings = loadBookings();

  const bookingObject = {
    id: bookingID,
    market: marketText,
    phone: formattedPhone,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  bookings.unshift(bookingObject);
  saveBookings(bookings);

  renderBookings();
  showNotification("Booking saved permanently!", "success");

  document.getElementById("paymentForm").reset();
});

// ============================
// PRINT
// ============================

function printReceipt() {
  window.print();
}

// ============================
// CONFIRM BOOKING
// ============================

function confirmBooking() {
  window.location.href = "https://wa.me/919494347349";
}

// ============================
// LOAD BOOKINGS ON START
// ============================

renderBookings();
</script>
