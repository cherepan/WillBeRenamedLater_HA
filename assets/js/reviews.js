// Загружаем данные и отображаем всё
async function loadReviews() {
  const res = await fetch("assets/data/reviews.json");
  const data = await res.json();

  const grouped = groupByProfessor(data);
  window.allGrouped = grouped; // сохраняем глобально для фильтра

  renderReviews(grouped);
  setupFilter();
}

// Группируем по professor
function groupByProfessor(data) {
  const grouped = {};

  for (const review of data) {
    const name = review.professor || "Unknown";
    if (!grouped[name]) {
      grouped[name] = {
        institution: review.institution || "–",
        reviews: []
      };
    }
    grouped[name].reviews.push(review);
  }

  return grouped;
}

// Отображаем всё
function renderReviews(grouped) {
  const container = document.getElementById("reviews");
  container.innerHTML = "";

  for (const [name, info] of Object.entries(grouped)) {
    const block = document.createElement("div");
    block.className = "professor-block";

    const chartId = `chart-${name.replace(/\s+/g, "_")}`;

    // Подсчёт рейтингов
    const ratings = [0, 0, 0, 0, 0];
    for (const r of info.reviews) {
      if (r.rating >= 1 && r.rating <= 5) ratings[r.rating - 1]++;
    }

    block.innerHTML = `
      <h3>${name} — ${info.institution} <span style="color: gray; font-weight: normal;">(${info.reviews.length} reviews)</span></h3>
      <canvas id="${chartId}" width="300" height="150"></canvas>
      <div class="review-list">
        ${info.reviews.map(r => `
          <p><strong>${r.position || ''}:</strong> ${r.text}</p>
        `).join("")}
      </div>
    `;

    container.appendChild(block);

    // Рисуем гистограмму
    new Chart(document.getElementById(chartId), {
      type: 'bar',
      data: {
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: [{
          label: 'Ratings',
          data: ratings,
          backgroundColor: '#007acc'
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Фильтр по имени
function setupFilter() {
  const input = document.getElementById("filter-prof");
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase().trim();
    const filtered = {};

    for (const [name, info] of Object.entries(window.allGrouped)) {
      if (name.toLowerCase().includes(term)) {
        filtered[name] = info;
      }
    }

    renderReviews(filtered);
  });
}

loadReviews();
