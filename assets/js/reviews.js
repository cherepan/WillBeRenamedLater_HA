async function loadReviews() {
  const res = await fetch("assets/data/reviews.json");
  const data = await res.json();
  const container = document.getElementById("reviews");
  const stats = document.getElementById("stats");
  const input = document.getElementById("filter-prof");

  function render(reviews) {
    container.innerHTML = "";
    stats.innerText = `Showing ${reviews.length} review${reviews.length !== 1 ? "s" : ""}`;
    for (const r of reviews) {
      const el = document.createElement("div");
      el.className = "review";
      el.innerHTML = `
        <h3>${r.professor || "Unknown"} — ${r.institution || "?"}</h3>
        <p><strong>Position:</strong> ${r.position || "Not specified"}</p>
        <p><strong>Rating:</strong> ${r.rating}</p>
        <p>${r.text}</p>
      `;
      container.appendChild(el);
    }
  }

  render(data);

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    const filtered = data.filter(r => r.professor.toLowerCase().includes(q));
    render(filtered);
  });
}

loadReviews();
