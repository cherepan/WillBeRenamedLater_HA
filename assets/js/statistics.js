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

function renderDirectory(grouped) {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  for (const [name, info] of Object.entries(grouped)) {
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
  renderDirectory(grouped);
}

loadStats();
