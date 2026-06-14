const state = { selectedDateType: null, selectedDateTime: null, noCount: 0 };

const dateTypes = [
  { id: "food-movie", icon: "🍿", title: "Ăn uống + coi phim", description: "No bụng, vui vẻ, coi một bộ phim em thích." },
  { id: "coffee-movie", icon: "☕", title: "Cà phê + coi phim", description: "Nhẹ nhàng nói chuyện rồi mình đi xem phim." },
  { id: "custom", icon: "🎀", title: "Em chọn mood", description: "Em chọn món, chọn chỗ, chọn mọi thứ em thích." },
  { id: "surprise", icon: "✨", title: "Bất ngờ đi anh", description: "Anh tự lên plan, em chỉ cần xinh đẹp xuất hiện." }
];
const dateTimes = [
  { id: "saturday", icon: "🌤️", title: "Sáng thứ 7", description: "Đi sớm một chút, đỡ đông và có nhiều thời gian." },
  { id: "later", icon: "🌷", title: "Một dịp không xa", description: "Không cần gấp, lúc nào em thoải mái thì mình đi." },
  { id: "custom-time", icon: "🗓️", title: "Em chọn lịch nha", description: "Em chọn ngày tiện nhất, anh sắp xếp theo em." }
];
const $ = (selector) => document.querySelector(selector);

function card(item, group) {
  return `<button class="choice-card" data-group="${group}" data-id="${item.id}">
    <span class="card-glow"></span><span class="choice-icon">${item.icon}</span>
    <strong>${item.title}</strong><small>${item.description}</small><i>chọn chiếc này ♡</i>
  </button>`;
}
$("#dateOptions").innerHTML = dateTypes.map((item) => card(item, "date")).join("");
$("#timeOptions").innerHTML = dateTimes.map((item) => card(item, "time")).join("");

const noLines = ["Ủa nút này hơi khó bấm á", "Em suy nghĩ lại xíu đi", "Nút đồng ý đang đẹp hơn đó", "Anh thấy em sắp đồng ý rồi á"];
function dodgeNo() {
  state.noCount += 1;
  const playground = $("#answerPlayground");
  const maxX = Math.max(30, playground.clientWidth - $("#noBtn").offsetWidth);
  const maxY = Math.max(30, playground.clientHeight - $("#noBtn").offsetHeight);
  $("#noBtn").style.left = `${Math.random() * maxX}px`;
  $("#noBtn").style.top = `${Math.random() * maxY}px`;
  const scale = Math.min(2.25, 1 + state.noCount * .17);
  $("#yesBtn").style.transform = `scale(${scale})`;
  $("#tease").textContent = noLines[state.noCount % noLines.length];
}
$("#noBtn").addEventListener("mouseenter", dodgeNo);
$("#noBtn").addEventListener("touchstart", (event) => { event.preventDefault(); dodgeNo(); });
$("#noBtn").addEventListener("click", dodgeNo);

$("#yesBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "auto" });
  $("#planner").hidden = false;
  document.body.classList.add("planning");
  requestAnimationFrame(() => $("#planner").classList.add("open"));
  burst(28);
});

function switchScene(from, to, progress) {
  const current = $(from);
  const next = $(to);
  current.classList.add("exit");
  next.classList.add("entering");
  setTimeout(() => {
    current.classList.remove("active", "exit");
    next.classList.remove("entering");
    next.classList.add("active");
    $("#progress").textContent = progress;
  }, 520);
}

$("#dateOptions").addEventListener("click", (event) => {
  const cardElement = event.target.closest(".choice-card");
  if (!cardElement) return;
  state.selectedDateType = dateTypes.find((item) => item.id === cardElement.dataset.id);
  cardElement.classList.add("picked");
  burst(8);
  setTimeout(() => switchScene("#dateScene", "#timeScene", "02 / chọn thời gian"), 260);
});

$("#timeOptions").addEventListener("click", (event) => {
  const cardElement = event.target.closest(".choice-card");
  if (!cardElement) return;
  state.selectedDateTime = dateTimes.find((item) => item.id === cardElement.dataset.id);
  cardElement.classList.add("picked");
  renderSummary();
  burst(8);
  setTimeout(() => switchScene("#timeScene", "#finalScene", "03 / chốt kèo"), 260);
});

function renderSummary() {
  const rows = [
    ["Người rủ", "Anh"], ["Người được rủ", "Minh Thư đáng eooo"],
    ["Kiểu date", state.selectedDateType.title], ["Thời gian", state.selectedDateTime.title],
    ["Trạng thái", "Chờ em chốt kèo ♡"]
  ];
  $("#summaryList").innerHTML = rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join("");
}

$("#confirmDate").addEventListener("click", () => {
  switchScene("#finalScene", "#successScene", "CONFIRMED ♡");
  burst(55);
});
$("#backToTicket").addEventListener("click", () => switchScene("#successScene", "#finalScene", "03 / kèo date"));

function burst(count = 12) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = ["♡", "♥", "✦"][Math.floor(Math.random() * 3)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.bottom = "-20px";
    heart.style.fontSize = `${16 + Math.random() * 25}px`;
    heart.style.color = ["#fff", "#ff8faa", "#e94f79", "#ffd879"][Math.floor(Math.random() * 4)];
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2800);
  }
}

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    const heroPhoto = $(".hero-photo");
    if (heroPhoto && !document.body.classList.contains("planning")) {
      heroPhoto.style.transform = `translate3d(${x * 7}px, ${y * 5}px, 0)`;
    }
  }, { passive: true });

  document.addEventListener("pointerout", () => {
    const heroPhoto = $(".hero-photo");
    if (heroPhoto) heroPhoto.style.transform = "";
  });
}

const galleryObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    entry.target.classList.add("in-view");
    $(".scroll-cue").classList.add("visible");
  } else {
    $(".scroll-cue").classList.remove("visible");
  }
}, { threshold: .12 });
galleryObserver.observe($("#cuteGallery"));

$(".scroll-cue").addEventListener("click", () => $(".scroll-cue").classList.remove("visible"));
