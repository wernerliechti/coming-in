import { db } from "./firebase-config.js";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const DISPLAY_NAME_KEY = "hype_display_name";

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "anonym";
}

const nameInput = document.getElementById("hype-name");
const hypeBtn = document.getElementById("hype-btn");
const myCountEl = document.getElementById("hype-my-count");
const leaderboardEl = document.getElementById("hype-leaderboard");
const statusEl = document.getElementById("hype-status");

const savedName = localStorage.getItem(DISPLAY_NAME_KEY) || "";
if (nameInput) nameInput.value = savedName;

let myDocId = savedName ? normalizeName(savedName) : null;
let unsubscribeMine = null;
let debounceTimer = null;

function watchMine(docId) {
  if (unsubscribeMine) unsubscribeMine();
  if (!docId) {
    if (myCountEl) myCountEl.textContent = "0";
    return;
  }
  const ref = doc(db, "hype", docId);
  unsubscribeMine = onSnapshot(ref, (snap) => {
    const count = snap.exists() ? snap.data().count : 0;
    if (myCountEl) myCountEl.textContent = String(count);
  });
}

watchMine(myDocId);

if (nameInput) {
  nameInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const name = nameInput.value.trim();
      myDocId = name ? normalizeName(name) : null;
      watchMine(myDocId);
    }, 300);
  });
}

if (hypeBtn) {
  hypeBtn.addEventListener("click", async () => {
    const rawName = (nameInput?.value || "").trim();
    if (!rawName) {
      if (statusEl) statusEl.textContent = "Bitte zuerst deinen Namen eingeben.";
      nameInput?.focus();
      return;
    }
    if (rawName.length >= 50) {
      if (statusEl) statusEl.textContent = "Name ist zu lang (max. 49 Zeichen).";
      return;
    }

    localStorage.setItem(DISPLAY_NAME_KEY, rawName);
    if (statusEl) statusEl.textContent = "";

    const newDocId = normalizeName(rawName);
    if (newDocId !== myDocId) {
      myDocId = newDocId;
      watchMine(myDocId);
    }

    hypeBtn.disabled = true;
    try {
      const ref = doc(db, "hype", myDocId);
      await setDoc(
        ref,
        {
          displayName: rawName,
          count: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Hype write failed", err);
      if (statusEl) statusEl.textContent = "Ups, das hat nicht geklappt. Nochmal versuchen.";
    } finally {
      hypeBtn.disabled = false;
    }
  });
}

if (leaderboardEl) {
  const q = query(collection(db, "hype"), orderBy("count", "desc"), limit(20));
  onSnapshot(q, (snapshot) => {
    leaderboardEl.innerHTML = "";
    let rank = 0;
    snapshot.forEach((docSnap) => {
      rank += 1;
      const data = docSnap.data();
      const li = document.createElement("li");
      if (docSnap.id === myDocId) li.classList.add("me");
      li.innerHTML = `
        <span class="rank">${rank}</span>
        <span class="name">${escapeHtml(data.displayName || "?")}</span>
        <span class="score">${data.count ?? 0}</span>
      `;
      leaderboardEl.appendChild(li);
    });
    if (rank === 0) {
      leaderboardEl.innerHTML = '<li class="hint">Noch niemand hat gehypt — sei die/der Erste!</li>';
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
