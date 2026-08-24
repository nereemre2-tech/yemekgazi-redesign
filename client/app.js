/* Tasarım yaklaşımı: Öğle Arası Editoryali — sıcak, dokunsal ve bilgi öncelikli kampüs yemek rehberi. */
const images = {
  dolma: "/manus-storage/yemekgazi-dolma_0ddf39a2.png",
  soup: "/manus-storage/yemekgazi-soup_17d420a4.png",
  watermelon: "/manus-storage/yemekgazi-watermelon_c038c215.png",
};

const menus = {
  student: {
    label: "Öğrenci yemekhanesi",
    source: "https://mediko.gazi.edu.tr/view/page/20412/yemek-listesi",
    breakfast: {
      title: "Kahvaltı", service: "07.30 — 09.30", calories: "410–530", note: "Ders öncesi hafif ama sıcak bir başlangıç.",
      items: [
        ["Peynir tabağı", "130–160 kcal", "Günün ilk molası için sade ve dengeli bir seçenek.", "dolma"],
        ["Haşlanmış yumurta", "70–90 kcal", "Protein içeriği günün ritmine eşlik eder.", "soup"],
        ["Zeytin, reçel ve ekmek", "210–280 kcal", "Servis miktarı gün içinde değişebilir.", "watermelon"],
      ],
    },
    lunch: {
      title: "Öğle yemeği", service: "11.30 — 14.00", calories: "620–840", note: "Yoğurtlu ana yemek, yaz meyvesi ve çorbayla dengeli bir tabak.",
      items: [
        ["Karışık dolma (yoğurt)", "250–400 kcal", "Biber ve kabak dolması; yoğurt eşliğinde servis edilir.", "dolma"],
        ["Alaca çorba", "150–250 kcal", "Bakliyat ve tahıl içeren sıcak başlangıç.", "soup"],
        ["Karpuz", "70–90 kcal", "Mevsim meyvesi ile servis tamamlanır.", "watermelon"],
        ["Ekmek", "150–200 kcal", "Günlük servis miktarı değişebilir.", "dolma"],
      ],
    },
    dinner: {
      title: "Akşam yemeği", service: "16.30 — 18.30", calories: "580–760", note: "Günün sonunda familiar, sıcak ve sade bir menü.",
      items: [
        ["Sebzeli bulgur pilavı", "270–350 kcal", "Sebze ilaveli sıcak pilav.", "dolma"],
        ["Yoğurtlu çorba", "130–190 kcal", "Yumuşak içimli, sıcak başlangıç.", "soup"],
        ["Mevsim meyvesi", "80–120 kcal", "Günlük tedarike göre farklılaşabilir.", "watermelon"],
      ],
    },
  },
  hospital: {
    label: "Hastane / stajyer yemekhanesi",
    source: "https://hastane.gazi.edu.tr/view/page/298200/aralik-yemek-listesi",
    breakfast: {
      title: "Kahvaltı", service: "07.00 — 09.00", calories: "350–470", note: "Erken mesai için pratik bir sabah menüsü.",
      items: [
        ["Peynir ve zeytin", "110–150 kcal", "Günün klasik kahvaltı tabağı.", "dolma"],
        ["Çay ve ekmek", "120–170 kcal", "Servis saati içinde tazelenir.", "soup"],
        ["Meyve", "70–100 kcal", "Mevsim meyvesi seçeneği.", "watermelon"],
      ],
    },
    lunch: {
      title: "Öğle yemeği", service: "12.00 — 14.00", calories: "650–880", note: "Mesai arasında hızlı ama doyurucu bir öğle molası.",
      items: [
        ["Etli sebze", "300–420 kcal", "Günün sıcak ana yemeği.", "dolma"],
        ["Tarhana çorbası", "130–200 kcal", "Geleneksel sıcak başlangıç.", "soup"],
        ["Karpuz", "70–90 kcal", "Serin, mevsimlik eşlikçi.", "watermelon"],
        ["Ekmek", "150–200 kcal", "Günlük servis miktarı değişebilir.", "dolma"],
      ],
    },
    dinner: {
      title: "Akşam yemeği", service: "18.00 — 19.15", calories: "470–740", note: "Akşam servisi için sade, tamamlayıcı bir menü.",
      items: [
        ["Karışık dolma (yoğurt)", "250–400 kcal", "Yoğurt eşliğinde günlük ana yemek.", "dolma"],
        ["Alaca çorba", "150–250 kcal", "Bakliyatlı sıcak başlangıç.", "soup"],
        ["Karpuz", "70–90 kcal", "Mevsim meyvesi.", "watermelon"],
      ],
    },
  },
};

const state = { location: "student", meal: "lunch", date: new Date(2026, 7, 24) };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const menuList = $("#menuList");
const dialog = $("#actionDialog");
let toastTimer;

function mealData() {
  return menus[state.location][state.meal];
}

function formatDate(date) {
  return new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)
    .replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("tr-TR"));
}

function renderMenu() {
  const data = mealData();
  $("#dateText").textContent = formatDate(state.date);
  $("#locationTitle").textContent = menus[state.location].label;
  $("#mealTitle").textContent = data.title;
  $("#serviceTime").textContent = data.service;
  $("#totalCalories").innerHTML = `${data.calories} <small>kcal</small>`;
  $("#mealCount").textContent = `${data.items.length} kalem yemek`;
  $("#dailyNote").textContent = data.note;
  menuList.innerHTML = data.items.map((item, index) => `
    <button class="menu-entry" type="button" aria-expanded="false">
      <span class="menu-number">0${index + 1}</span>
      <span class="food-thumb"><img src="${images[item[3]]}" alt="${item[0]} görseli" /></span>
      <span class="entry-copy"><strong>${item[0]}</strong><span>Tahmini ${item[1]}</span></span>
      <span class="entry-arrow" aria-hidden="true">+</span>
      <span class="detail-row">${item[2]}</span>
    </button>
  `).join("");
  $$(".menu-entry").forEach((entry) => entry.addEventListener("click", () => {
    const expanded = entry.classList.toggle("is-expanded");
    entry.setAttribute("aria-expanded", String(expanded));
    entry.querySelector(".entry-arrow").textContent = expanded ? "−" : "+";
  }));
}

function updateActiveButtons() {
  $$(".location-tab").forEach((button) => {
    const selected = button.dataset.location === state.location;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  $$(".meal-tab").forEach((button) => {
    const selected = button.dataset.meal === state.meal;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function openDialog(title, text, options) {
  $("#dialogTitle").textContent = title;
  $("#dialogText").textContent = text;
  $("#dialogOptions").innerHTML = options.map((option) => `<button type="button">${option}</button>`).join("");
  $$("#dialogOptions button").forEach((button) => button.addEventListener("click", () => {
    dialog.close();
    showToast(`“${button.textContent}” seçildi. Bu prototipte kayıt işlemi gösterim amaçlıdır.`);
  }));
  dialog.showModal();
}

$$(".location-tab").forEach((button) => button.addEventListener("click", () => {
  state.location = button.dataset.location;
  updateActiveButtons();
  renderMenu();
}));

$$(".meal-tab").forEach((button) => button.addEventListener("click", () => {
  state.meal = button.dataset.meal;
  updateActiveButtons();
  renderMenu();
}));

$("#previousDay").addEventListener("click", () => {
  state.date.setDate(state.date.getDate() - 1);
  renderMenu();
});

$("#nextDay").addEventListener("click", () => {
  state.date.setDate(state.date.getDate() + 1);
  renderMenu();
});

$("#dateButton").addEventListener("click", () => showToast("Tarih seçimi bu tek sayfalık prototipte önceki/sonraki gün düğmeleriyle gösteriliyor."));
$("#sourceButton").addEventListener("click", () => window.open(menus[state.location].source, "_blank", "noopener,noreferrer"));
$("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("is-night");
  showToast(document.body.classList.contains("is-night") ? "Akşam görünümü açıldı." : "Gündüz görünümü açıldı.");
});
$("#languageButton").addEventListener("click", () => showToast("İngilizce sürüm için içerik çevirisi bağlantısı eklenebilir."));

function openReminder() {
  openDialog("Menü hatırlatması", "Servisten ne kadar önce haberdar olmak istediğini seç.", ["15 dakika önce", "30 dakika önce", "60 dakika önce"]);
}

$("#headerReminder").addEventListener("click", openReminder);
$("#shareButton").addEventListener("click", async () => {
  const text = `${formatDate(state.date)} — ${menus[state.location].label} ${mealData().title} menüsü`;
  try { await navigator.clipboard.writeText(text); showToast("Menü özeti panoya kopyalandı."); }
  catch { showToast("Menü özeti paylaşılmaya hazır: " + text); }
});
$("#reportButton").addEventListener("click", () => openDialog("Bir düzeltme bildir", "Resmî kaynağa göre farklı gördüğün bilgiyi iletmek için bir konu seç.", ["Yemek adı farklı", "Servis saati farklı", "Diğer bir not"]));
$$(".tool-row").forEach((button) => button.addEventListener("click", () => {
  const tool = button.dataset.tool;
  if (tool === "telegram") openReminder();
  if (tool === "calendar") openDialog("Takvimine ekle", "Aylık yemek listesini kişisel takvimine aktarabilirsin.", ["Bu ayı indir (.ics)", "Sadece öğle menülerini ekle"]);
  if (tool === "feedback") openDialog("Geri bildirim gönder", "Bir sonraki adımda geri bildirim formu açılabilir.", ["Tasarım önerisi", "İçerik düzeltmesi"]);
}));
$("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

renderMenu();
