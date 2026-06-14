const flirts = [
  "Cậu có bản đồ không? Tớ cứ lạc trong mắt cậu mãi.",
  "Phô mai que cần tương ớt, còn tớ thì cần cậu.",
  "Dạo này tớ hơi thiếu vitamin Cậu.",
  "Trái Đất có 8 tỷ người, mà mắt tớ cứ tự động tìm cậu.",
  "Cậu học giỏi Xuất sắc, còn tớ chỉ giỏi xuất hiện cạnh cậu thôi.",
  "Tớ không mê tín, nhưng gặp cậu chắc chắn là điềm lành.",
  "Cậu có mỏi chân không? Vì cậu chạy trong đầu tớ cả ngày rồi."
];

const flirtText = document.querySelector("#flirtText");
const newFlirt = document.querySelector("#newFlirt");
const modal = document.querySelector("#letterModal");
const noBtn = document.querySelector("#noBtn");
const success = document.querySelector("#successScreen");

function burst(count = 18) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = ["♡", "♥", "✦", "🎀"][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.bottom = `${-10 + Math.random() * 30}px`;
    heart.style.fontSize = `${18 + Math.random() * 34}px`;
    heart.style.color = ["#fff", "#ff8faa", "#e94f79", "#ffd879"][Math.floor(Math.random() * 4)];
    heart.style.animationDelay = `${Math.random() * .5}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3100);
  }
}

newFlirt.addEventListener("click", () => {
  let next = flirts[Math.floor(Math.random() * flirts.length)];
  while (next === flirtText.textContent) next = flirts[Math.floor(Math.random() * flirts.length)];
  flirtText.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 });
  flirtText.textContent = next;
});

document.querySelector("#openLetter").addEventListener("click", () => modal.showModal());
document.querySelector("#closeLetter").addEventListener("click", () => modal.close());

function dodge() {
  const x = Math.random() * 180 - 90;
  const y = Math.random() * 100 - 50;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  noBtn.textContent = ["Khoan đã", "Suy nghĩ lại", "Nút gì lạ vậy?", "Bấm nút hồng đi"][Math.floor(Math.random() * 4)];
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", dodge);

document.querySelector("#yesBtn").addEventListener("click", () => {
  success.classList.add("show");
  burst(60);
});

document.querySelector("#closeSuccess").addEventListener("click", () => success.classList.remove("show"));
