const state = {
  hasAcceptedDateInvite: false,
  selectedDateType: null,
  customDateIdea: "",
  selectedDateTime: null,
  customDateTime: "",
  finalConfirmed: false,
  isSubmitting: false,
  submitStatus: "idle",
  submitError: ""
};

const dateTypes = [
  { id: "food-movie", icon: "🍿", title: "Ăn uống + coi phim", description: "Mình đi ăn một món ngon trước, rồi xem một bộ phim em thích.", note: "Hợp nếu em muốn một buổi date no bụng và dễ vui." },
  { id: "coffee-movie", icon: "☕", title: "Cà phê + coi phim", description: "Mình ngồi cà phê nói chuyện một chút, rồi đi xem phim.", note: "Hợp nếu em muốn nhẹ nhàng, dễ nói chuyện hơn." },
  { id: "custom", icon: "🎀", title: "Em muốn gì cũng được", description: "Em chọn món, chọn chỗ, chọn mood. Anh nghe theo.", note: "Hợp nếu em đã có idea riêng." },
  { id: "surprise", icon: "✨", title: "Bất ngờ đi anh", description: "Anh tự lên plan, em chỉ cần xinh đẹp xuất hiện.", note: "Hợp nếu em muốn anh tự chuẩn bị từ A tới Z." }
];

const dateTimes = [
  { id: "saturday", icon: "🌤️", title: "Sáng thứ 7", description: "Một buổi sáng nhẹ nhàng, đi ăn hoặc cà phê rồi xem phim cũng xinh.", note: "Hợp nếu em thích đi sớm, đỡ đông và có nhiều thời gian." },
  { id: "later", icon: "🌷", title: "Một dịp không xa", description: "Không cần gấp. Khi nào em thấy thoải mái thì mình đi.", note: "Hợp nếu em muốn chọn ngày sau." },
  { id: "custom-time", icon: "🗓️", title: "Em chọn lịch nha", description: "Em chọn ngày giờ tiện nhất, anh sẽ sắp xếp theo em.", note: "Hợp nếu lịch của em hơi khó đoán." }
];

const $ = (selector) => document.querySelector(selector);

function optionCard(item, group) {
  return `<button class="option-card" data-group="${group}" data-id="${item.id}">
    <span class="option-icon">${item.icon}</span><span class="selected-heart">♡</span>
    <strong>${item.title}</strong><span>${item.description}</span><small>${item.note}</small>
  </button>`;
}

$("#dateOptions").innerHTML = dateTypes.map((item) => optionCard(item, "date")).join("");
$("#timeOptions").innerHTML = dateTimes.map((item) => optionCard(item, "time")).join("");

function reveal(selector) {
  const element = $(selector);
  element.hidden = false;
  requestAnimationFrame(() => element.classList.add("is-visible"));
  setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
}

function selectCard(card) {
  document.querySelectorAll(`[data-group="${card.dataset.group}"]`).forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");
}

$("#acceptInvite").addEventListener("click", () => {
  state.hasAcceptedDateInvite = true;
  reveal("#dateChoice");
  burst(12);
});

$("#thinkBtn").addEventListener("click", () => {
  $("#softMessage").textContent = "Không sao hết. Em cứ suy nghĩ thoải mái nha, anh vẫn thấy em đáng yêu.";
});

$("#dateOptions").addEventListener("click", (event) => {
  const card = event.target.closest(".option-card");
  if (!card) return;
  selectCard(card);
  state.selectedDateType = dateTypes.find((item) => item.id === card.dataset.id);
  $("#dateIdeaWrap").hidden = state.selectedDateType.id !== "custom";
  if (state.selectedDateTime) updatePlan();
  reveal("#timeChoice");
});

$("#timeOptions").addEventListener("click", (event) => {
  const card = event.target.closest(".option-card");
  if (!card) return;
  selectCard(card);
  state.selectedDateTime = dateTimes.find((item) => item.id === card.dataset.id);
  $("#dateTimeWrap").hidden = state.selectedDateTime.id !== "custom-time";
  updatePlan();
  reveal("#finalConfirm");
});

$("#dateIdea").addEventListener("input", (event) => { state.customDateIdea = event.target.value.trim(); });
$("#dateTime").addEventListener("input", (event) => { state.customDateTime = event.target.value.trim(); updatePlan(); });

function updatePlan() {
  const type = state.selectedDateType?.id;
  const time = state.selectedDateTime?.id;
  let text = "Vậy anh sẽ chuẩn bị một buổi đi chơi thật gọn, xinh và hợp ý em nha.";
  if (time === "custom-time") text = "Vậy anh sẽ sắp xếp theo lịch em chọn nha.";
  else if (type === "food-movie" && time === "saturday") text = "Vậy sáng thứ 7 mình đi ăn gì đó ngon trước, rồi xem một bộ phim hợp mood của em nha.";
  else if (type === "coffee-movie" && time === "later") text = "Vậy một dịp không xa, mình đi cà phê nói chuyện trước rồi xem phim sau nha.";
  else if (type === "food-movie") text = "Vậy mình đi ăn gì đó ngon trước, rồi xem một bộ phim hợp mood của em nha.";
  else if (type === "coffee-movie") text = "Vậy mình đi cà phê trước cho dễ nói chuyện, rồi xem phim sau nha.";
  else if (type === "custom") text = "Vậy em gợi ý đi, anh sẽ sắp xếp theo ý em.";
  else if (type === "surprise") text = "Rồi, để anh tự lên plan. Em chỉ cần chuẩn bị tinh thần được chiều thôi.";
  $("#dynamicPlan").textContent = text;
}

async function submitDateResponse(payload) {
  const endpoint = window.DATE_RESPONSE_ENDPOINT;
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Endpoint không nhận được kết quả.");
    return "endpoint";
  }

  const subject = encodeURIComponent("Kèo date đã được em chọn ♡");
  const body = encodeURIComponent(
    `Kiểu date: ${payload.selectedDateType}\nGhi chú của em: ${payload.customDateIdea || "Không có"}\nThời gian: ${payload.selectedDateTime}\nLịch em gợi ý: ${payload.customDateTime || "Không có"}\nThời điểm gửi: ${payload.submittedAt}`
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  return "mailto";
}

$("#confirmDate").addEventListener("click", async () => {
  if (state.isSubmitting) return;
  state.isSubmitting = true;
  state.submitStatus = "loading";
  const button = $("#confirmDate");
  button.disabled = true;
  button.textContent = "Anh đang lưu kèo date của mình…";

  const payload = {
    selectedDateType: state.selectedDateType.title,
    selectedDateTypeDescription: state.selectedDateType.description,
    customDateIdea: state.customDateIdea,
    selectedDateTime: state.selectedDateTime.title,
    selectedDateTimeDescription: state.selectedDateTime.description,
    customDateTime: state.customDateTime,
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  try {
    const method = await submitDateResponse(payload);
    state.submitStatus = "success";
    if (method === "mailto") {
      state.submitError = "Anh chưa nhận được kết quả tự động, nhưng em có thể gửi email vừa mở hoặc chụp màn hình gửi anh nha.";
    }
  } catch (error) {
    state.submitStatus = "error";
    state.submitError = "Anh chưa nhận được kết quả tự động, nhưng em có thể chụp màn hình gửi anh nha.";
  } finally {
    state.isSubmitting = false;
    state.finalConfirmed = true;
    renderSummary();
    reveal("#resultSection");
    burst(40);
  }
});

function renderSummary() {
  const rows = [
    ["Người rủ", "Anh"], ["Người được rủ", "Em"],
    ["Kiểu date đã chọn", state.selectedDateType.title],
    ["Ghi chú của em", state.customDateIdea || "Để anh chuẩn bị nha"],
    ["Thời gian em chọn", state.selectedDateTime.title],
    ["Lịch em gợi ý", state.customDateTime || "Mình sẽ chốt sau"],
    ["Trạng thái", "Đã chốt, anh đang chuẩn bị"]
  ];
  $("#summaryList").innerHTML = rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join("");
  if (state.submitError) {
    $("#submitError").hidden = false;
    $("#submitError").textContent = state.submitError;
  }
}

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
