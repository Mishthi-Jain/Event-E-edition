// ==============================
//  ADD EVENT FUNCTIONALITY
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const eventForm = document.getElementById("addeve");
    const eventList = document.getElementById("upcoming");

    let events = JSON.parse(localStorage.getItem("events")) || [];

    // Load events at start
    displayEvents();

    // Add new event
    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("name").value.trim();
        const about = document.getElementById("about").value.trim();
        const date = document.getElementById("Date").value;
        const venue = document.getElementById("Venue").value.trim();
        const image = document.getElementById("eventImage").value || "https://via.placeholder.com/300x150";

        if (!title || !about || !date || !venue) {
            alert("Please fill all fields!");
            return;
        }

        const eventObj = {
            id: Date.now(),
            title,
            about,
            date,
            venue,
            image
        };

        events.push(eventObj);
        localStorage.setItem("events", JSON.stringify(events));

        displayEvents();
        eventForm.reset();
        alert("Event Added Successfully!");
    });

    // ==============================
    //  DISPLAY EVENTS
    // ==============================
    function displayEvents() {
        eventList.innerHTML = "";

        if (events.length === 0) {
            eventList.innerHTML = "<p>No events added yet.</p>";
            return;
        }

        events.forEach(event => {
            let card = document.createElement("div");
            card.classList.add("event-card");

            card.innerHTML = `
                <img src="${event.image}" alt="${event.title}">
                <h3>${event.title}</h3>
                <p>${event.about}</p>
                <p><b>Date:</b> ${event.date}</p>
                <p><b>Venue:</b> ${event.venue}</p>
                <div class="card-buttons">
                    <button class="button" onclick="openBooking(${event.id})">Register</button>
                    <button class="button" style="background:#a83232;" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            `;

            eventList.appendChild(card);
        });
    }

    // ==============================
    //  DELETE EVENT FUNCTION
    // ==============================
    window.deleteEvent = function(eventId) {
        if (confirm("Are you sure you want to delete this event?")) {
            events = events.filter(ev => ev.id !== eventId);
            localStorage.setItem("events", JSON.stringify(events));
            displayEvents();

            // Optional: delete related registrations
            let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
            registrations = registrations.filter(reg => reg.eventId != eventId);
            localStorage.setItem("registrations", JSON.stringify(registrations));

            alert("Event deleted successfully!");
        }
    };

});

// ==============================
//  BOOKING POPUP FUNCTIONALITY
// ==============================

const bookingPopup = document.getElementById("Book");
const closePopup = document.getElementById("final");

function openBooking(eventId) {
    bookingPopup.style.display = "block";
    bookingPopup.setAttribute("data-event-id", eventId);
}

closePopup.addEventListener("click", () => {
    bookingPopup.style.display = "none";
});

// Close popup on background click
window.addEventListener("click", (e) => {
    if (e.target === bookingPopup) {
        bookingPopup.style.display = "none";
    }
});

// ==============================
//  BOOKING FORM FUNCTIONALITY
// ==============================

document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const seats = parseInt(document.getElementById("userSeats").value);
    const eventId = document.getElementById("Book").getAttribute("data-event-id");

    if (!userName || !email || !seats || seats <= 0) {
        alert("Please fill all fields correctly!");
        return;
    }

    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    registrations.push({
        id: Date.now(),
        userName,
        email,
        seats,
        eventId
    });

    localStorage.setItem("registrations", JSON.stringify(registrations));

    alert("Booking Confirmed!");

    document.getElementById("bookingForm").reset();
    bookingPopup.style.display = "none";
});
