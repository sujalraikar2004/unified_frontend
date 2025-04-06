



  function changeSlide(button, direction) {
    const sliderContainer = button.closest('.slider-container');
    const slider = sliderContainer.querySelector('.slider');
    const slides = slider.querySelectorAll('img');
    const sliderWidth = sliderContainer.offsetWidth;

    let currentSlide = parseInt(slider.dataset.currentSlide) || 0;
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slider.style.transform = `translateX(-${currentSlide * sliderWidth}px)`;
    slider.dataset.currentSlide = currentSlide;
}

function initializeSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('.slider');
        const slides = slider.querySelectorAll('img');
        const prevButton = container.querySelector('.prev');
        const nextButton = container.querySelector('.next');

        // Hide buttons if only one image is present
        if (slides.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }

        // Initialize the slider's current slide
        slider.dataset.currentSlide = 0;
    });
}

// Initialize all sliders on page load
initializeSliders();




(function () {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const events = {
    "2024-12-17": ["Latent Arena"],
    "2024-11-30": ["Inaugural Day "],
    "2025-02-18": ["Another event"]
  };

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  const monthYear = document.getElementById("monthYear");
  const calendarDates = document.getElementById("calendarDates");
  const eventsList = document.getElementById("events");

  function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = `${monthNames[month]} ${year}`;
    calendarDates.innerHTML = "";
    eventsList.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
      calendarDates.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const today = new Date();
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = events[dateKey] ? "custom-has-event" : "";

      calendarDates.innerHTML += `
        <div 
          class="${isToday ? "today" : ""} ${hasEvent}" 
          data-date="${dateKey}">
          ${day}
        </div>`;
    }

    document.querySelectorAll(".custom-calendar-dates div").forEach((date) =>
      date.addEventListener("click", () => {
        const dateKey = date.getAttribute("data-date");
        renderEvents(dateKey);
      })
    );
  }

  function renderEvents(dateKey) {
    eventsList.innerHTML = "";
    const eventItems = events[dateKey] || ["No events scheduled."];
    eventItems.forEach((event) => {
      eventsList.innerHTML += `<li>${event}</li>`;
    });
  }

  document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
})();



// script.js

// Function to check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

// Get all sections to be revealed
const revealSections = document.querySelectorAll('.reveal-section');

// Function to handle scroll event
function handleScroll() {
  revealSections.forEach(section => {
    if (isInViewport(section)) {
      section.classList.add('revealed'); // Add the class to trigger animation
    }
  });
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// Run the check when the page loads to reveal sections that are already in view
document.addEventListener('DOMContentLoaded', handleScroll);








