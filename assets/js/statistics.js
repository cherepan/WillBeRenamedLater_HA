function groupByProfessor(data) {
  const grouped = {};

  for (const review of data) {
    const name = review.professor || "Unknown";
    if (!grouped[name]) {
      grouped[name] = {
        institution: review.institution || "–",
        total: 0,
        positive: 0,
        negative: 0,
        reviews: []
      };
    }

    grouped[name].total += 1;
    if (review.rating >= 4) grouped[name].positive += 1;
    if (review.rating <= 2) grouped[name].negative += 1;
    grouped[name].reviews.push(review);
  }

  return grouped;
}

let globalGrouped = {};

function sortAndRender(criteria = "total") {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  const entries = Object.entries(globalGrouped);

  entries.sort((a, b) => {
    const A = a[1], B = b[1];
    if (criteria === "total") return B.total - A.total;
    if (criteria === "negative") {
      const an = A.negative / A.total || 0;
      const bn = B.negative / B.total || 0;
      return bn - an;
    }
    return 0;
  });

  for (const [name, info] of entries) {
    const block = document.createElement("div");
    block.className = "professor-block";
    const chartId = `chart-${name.replace(/\s+/g, '_')}`;

    block.innerHTML = `
      <h3>${name} — ${info.institution} <span style="font-weight: normal; color: gray;">(${info.total} review${info.total > 1 ? 's' : ''})</span></h3>
      <canvas id="${chartId}" width="400" height="200"></canvas>
      <p>Reviews: ${info.total} (✅ ${info.positive} / ❌ ${info.negative})</p>
      <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">Show/Hide Reviews</button>
      <div class="review-list" style="display: none;">
        ${info.reviews.map(r => `<p><strong>${r.position || ''}:</strong> ${r.text}</p>`).join('')}
      </div>
    `;
    container.appendChild(block);

    const ratings = [1, 2, 3, 4, 5].map(score =>
      info.reviews.filter(r => r.rating === score).length
    );

    new Chart(document.getElementById(chartId), {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Number of ratings',
          data: ratings,
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }
}

async function loadStats() {
  const res = await fetch("assets/data/reviews.json");
  const data = await res.json();
  globalGrouped = groupByProfessor(data);

  const controls = document.createElement("div");
  controls.innerHTML = `
    <label>Sort by:</label>
    <select id="sort-mode">
      <option value="total">Total reviews</option>
      <option value="negative">% Negative</option>
    </select>
  `;
  document.getElementById("directory").before(controls);

  document.getElementById("sort-mode").addEventListener("change", (e) => {
    sortAndRender(e.target.value);
  });

  sortAndRender(); // default
}

loadStats();
