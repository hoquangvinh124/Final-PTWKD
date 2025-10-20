// Nhân đôi hàng poster để tạo hiệu ứng chạy vô hạn
document.querySelectorAll('.poster-row').forEach(row => {
  const cloneContent = row.innerHTML;
  row.innerHTML += cloneContent;
});

// Danh sách phim
const movies = 
[
  {
    "title": "BATMAN FOREVER",
    "poster": "assets/images/film VHS/BatmanForever.png",
    "year": 1995,
    "director": "Joel Schumacher",
    "description": "Batman faces Two-Face and The Riddler as they threaten Gotham City with chaos and riddles."
  },
  {
    "title": "TOY STORY 2",
    "poster": "assets/images/film VHS/toystory.png",
    "year": 1999,
    "director": "John Lasseter",
    "description": "When Woody is stolen by a toy collector, Buzz and his friends embark on a daring rescue mission."
  },
  {
    "title": "LIAR LIAR",
    "poster": "assets/images/film VHS/Liar-Liar.png",
    "year": 1997,
    "director": "Tom Shadyac",
    "description": "A fast-talking lawyer is magically forced to tell the truth for 24 hours after his son's birthday wish."
  },
  {
    "title": "TITANIC",
    "poster": "assets/images/film VHS/Titanic.png",
    "year": 1997,
    "director": "James Cameron",
    "description": "A poor artist and a wealthy young woman fall in love aboard the ill-fated RMS Titanic."
  },
  {
    "title": "MEN IN BLACK",
    "poster": "assets/images/film VHS/MIB.png",
    "year": 1997,
    "director": "Barry Sonnenfeld",
    "description": "Two secret agents protect Earth from extraterrestrial threats while keeping aliens hidden from the public."
  },
  {
    "title": "THE LION KING",
    "poster": "assets/images/film VHS/lionking.png",
    "year": 1994,
    "director": "Roger Allers & Rob Minkoff",
    "description": "A young lion prince flees his kingdom after tragedy, only to return and reclaim his rightful place as king."
  }
];

const scheduleDiv = document.getElementById("schedule");
const weekButtons = document.querySelectorAll("#weekBar button");
const datePicker = document.getElementById("datePicker");

// Khung giờ chiếu phim
const showtimes = [];
for (let hour = 0; hour < 24; hour += 2) {
  const h = String(hour).padStart(2, "0");
  showtimes.push(`${h}:00`);
}

// Lịch chiếu trong ngày
function displaySchedule(dayIndex) {
  scheduleDiv.innerHTML = "";
  showtimes.forEach((time, i) => {
    const movie = movies[i % movies.length];
    const endTime = getEndTime(time);
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${time} - ${endTime}</p>
      <button class="book-btn">BOOK NOW</button>
    `;
    scheduleDiv.appendChild(card);
  });
}

function getEndTime(start) {
  const [h, m] = start.split(":").map(Number);
  const endH = (h + 2) % 24;
  return `${String(endH).padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

weekButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    weekButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displaySchedule(btn.dataset.day);
  });
});

datePicker.addEventListener("change", () => {
  const date = new Date(datePicker.value);
  const day = (date.getDay() + 6) % 7;
  weekButtons[day].click();
});

const today = new Date();
const todayIndex = (today.getDay() + 6) % 7;
weekButtons[todayIndex].classList.add("active");
displaySchedule(todayIndex);

// Now & Next movie section
function toMinutes(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + (m || 0);
}

function renderNowNext() {
  const now = new Date();
  const curMin = now.getHours() * 60 + now.getMinutes();

  const scheduleList = showtimes.map((t, i) => ({
    index: i,
    start: toMinutes(t),
    end: (toMinutes(t) + 120) % (24 * 60),
    movie: movies[i % movies.length],
    timeLabel: `${t} - ${getEndTime(t)}`
  }));

  let currentSlot = null;
  for (let i = 0; i < scheduleList.length; i++) 
    {
        const s = scheduleList[i];
        if (s.start <= s.start + 120) 
            {
                if (s.start <= curMin && curMin < s.start + 120) 
                    {
                        currentSlot = s; break;
                }
        }
  }

  if (!currentSlot) 
    {
        const idx = Math.floor(now.getHours() / 2) % scheduleList.length;
        currentSlot = scheduleList[idx];
  }

  const nextSlot = scheduleList[(currentSlot.index + 1) % scheduleList.length];
  const currentBox = document.getElementById('currentBox');
  const nextBox = document.getElementById('nextBox');

  function renderBox(container, slot, overlayText) 
  {
    const m = slot.movie;
    container.innerHTML = `
      <div class="poster-wrap" role="button" tabindex="0">
        <img src="${m.poster}" alt="${m.title} poster">
        <div class="overlay">${overlayText}</div>
      </div>
      <div class="info">
        <h3>${m.title}</h3>
        <div class="time">${slot.timeLabel}</div>
        <div class="detail">
            <span class="label">Year:</span> <span>${m.year}</span>
        </div>
        <div class="detail">
            <span class="label">Director:</span> <span>${m.director}</span>
        </div>

        <p class="description">${m.description}</p>
      </div>
    `;

    const posterWrap = container.querySelector('.poster-wrap');
    posterWrap.addEventListener('click', () => {
      window.location.href = 'movieroom.html';
    });
    posterWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') 
        {
            e.preventDefault();
            window.location.href = 'movieroom.html';
      }
    });
  }

  renderBox(currentBox, currentSlot, 'WATCH NOW');
  renderBox(nextBox, nextSlot, 'BOOK NOW');
}

renderNowNext();
(function scheduleAutoUpdate()
{
  const now = new Date();
  const nextCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 2);
  const delay = nextCheck - now;
  setTimeout(() => {
    renderNowNext();
    setInterval(renderNowNext, 60 * 1000);
  }, delay);
})();
