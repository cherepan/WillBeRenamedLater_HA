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
    block.innerHTML = `
      <h3>${name} — ${info.institution}</h3>
      <p>Reviews: ${info.total} (✅ ${info.positive} / ❌ ${info.negative})</p>
      <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">Show/Hide Reviews</button>
      <div class="review-list" style="display: none;">
        ${info.reviews.map(r => `<p><strong>${r.position || ''}:</strong> ${r.text}</p>`).join('')}
      </div>
    `;
    container.appendChild(block);
  }
}


async function loadStats() {
  const res = await fetch("assets/data/reviews.json");
  const data = await res.json();
  const grouped = groupByProfessor(data);
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
