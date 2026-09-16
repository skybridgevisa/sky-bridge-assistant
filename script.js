/* ==========================================================
   SKY BRIDGE ASSISTANT CONFIGURATION
   Free client-side rule-based assistant. No API key required.
   Replace these values only if your business details change.
   ========================================================== */
const SKY_BRIDGE_CONFIG = {
  counselor: {
    name: "Zoya Siddiqui",
    phoneDisplay: "+91 8796854108",
    phone: "+918796854108",
    whatsapp: "918796854108",
    email: "skybridge.migrationoverseas@gmail.com"
  },
  international: {
    name: "Cristian Dobrea",
    phoneDisplay: "+380 63 053 7559",
    phone: "+380630537559",
    whatsapp: "380630537559"
  },
  office: {
    head: "15A, 3rd Floor, Pocket 1,\nNear HDFC Bank,\nMayur Vihar,\nDelhi – 110091, India",
    other: "Chisinau, Moldova 🇲🇩\nPoznan, Poland 🇵🇱"
  },
  disclaimer: "Visa approval is solely at the discretion of the relevant government or immigration authority. Sky Bridge provides consultancy and application assistance and does not guarantee visa approval."
};

/* ==========================================================
   RULE-BASED CHATBOT LOGIC
   This response engine is intentionally API-free and offline-safe.
   It can later be replaced by an AI/API adapter without changing UI code.
   ========================================================== */

const WELCOME = `Hello! 👋 Welcome to Sky Bridge.\n\nI'm the Sky Bridge Assistant. I can help you with general information about our visa services, destinations, documents and consultation process.\n\nHow can I help you today?`;
const QUICK = ["Study Visa", "Tourist Visa", "Work Permit", "Documents", "Destinations", "Talk to Counselor"];

const el = id => document.getElementById(id);
const launcher = el("sb-chat-launcher");
const chat = el("sb-chat");
const messages = el("sb-messages");
const quickReplies = el("sb-quick-replies");
const form = el("sb-form");
const input = el("sb-input");
const unread = el("sb-unread");

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

function linkHtml(text, href, primary=false) {
  return `<a class="sb-action${primary ? " primary" : ""}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
}

function counselorActions() {
  return `<div class="sb-contact-actions">
    ${linkHtml("📞 Call Counselor", `tel:${SKY_BRIDGE_CONFIG.counselor.phone}`, true)}
    ${linkHtml("💬 WhatsApp Counselor", `https://wa.me/${SKY_BRIDGE_CONFIG.counselor.whatsapp}?text=${encodeURIComponent("Hello Zoya, I need visa assistance from Sky Bridge.")}`)}
    ${linkHtml("✉️ Email Counselor", `mailto:${SKY_BRIDGE_CONFIG.counselor.email}`)}
  </div>`;
}

function internationalActions() {
  return `<div class="sb-contact-actions">
    ${linkHtml("📞 Call", `tel:${SKY_BRIDGE_CONFIG.international.phone}`, true)}
    ${linkHtml("💬 WhatsApp", `https://wa.me/${SKY_BRIDGE_CONFIG.international.whatsapp}?text=${encodeURIComponent("Hello Cristian, I have an international inquiry.")}`)}
  </div>`;
}

function addMessage(text, role="assistant", html=false) {
  const row = document.createElement("div");
  row.className = `sb-msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "sb-bubble";
  bubble.innerHTML = html ? text : escapeHtml(text);
  row.appendChild(bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "sb-msg assistant typing";
  row.id = "sb-typing";
  row.innerHTML = `<div class="sb-bubble"><span class="sb-dots"><i></i><i></i><i></i></span></div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() { el("sb-typing")?.remove(); }

function setQuickReplies(items=QUICK) {
  quickReplies.innerHTML = items.map(item => `<button type="button" class="sb-quick" data-quick="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("");
}

function openChat() {
  chat.classList.add("open");
  chat.setAttribute("aria-hidden", "false");
  launcher.setAttribute("aria-expanded", "true");
  unread.classList.add("hidden");
  setTimeout(() => input.focus(), 100);
}
function closeChat() {
  chat.classList.remove("open");
  chat.setAttribute("aria-hidden", "true");
  launcher.setAttribute("aria-expanded", "false");
}

function normalize(s) { return s.toLowerCase().replace(/[^a-z0-9+\s]/g, " ").replace(/\s+/g, " ").trim(); }
function hasAny(s, words) { return words.some(w => s.includes(w)); }

function responseFor(raw) {
  const s = normalize(raw);

  if (hasAny(s, ["international inquiry", "international enquiry", "international", "overseas inquiry", "overseas enquiry", "christian dobrea", "cristian dobrea"])) {
    return { text: `For international inquiries, you can contact:\n\n${SKY_BRIDGE_CONFIG.international.name}\n${SKY_BRIDGE_CONFIG.international.phoneDisplay}`, html: internationalActions(), quick: ["Talk to Counselor", "Office Address"] };
  }

  if (hasAny(s, ["office address", "office location", "where is your office", "address", "head branch", "branch location"])) {
    return { text: `Head Branch:\n${SKY_BRIDGE_CONFIG.office.head}\n\nOther locations:\n${SKY_BRIDGE_CONFIG.office.other}`, quick: ["Talk to Counselor", "Destinations"] };
  }

  if (hasAny(s, ["counselor", "counsellor", "contact", "phone number", "call you", "speak to", "talk to someone", "zoya", "consultation"])) {
    return { text: `${SKY_BRIDGE_CONFIG.counselor.name}\n${SKY_BRIDGE_CONFIG.counselor.phoneDisplay}\n${SKY_BRIDGE_CONFIG.counselor.email}\n\nFor personalized visa guidance, please contact our counselor.`, html: counselorActions(), quick: ["Study Visa", "Tourist Visa", "Work Permit"] };
  }

  if (hasAny(s, ["study visa", "student visa", "study abroad", "student permit", "education visa"])) {
    return { text: "A study visa allows an eligible student to study in another country. Requirements vary by destination and institution. Sky Bridge can provide general guidance regarding documentation and the application process.\n\nFor a case-specific assessment, you can speak with our counselor.", html: counselorActions(), quick: ["Documents", "Destinations", "Talk to Counselor"] };
  }

  if (hasAny(s, ["tourist visa", "tourism visa", "visit visa", "visitor visa", "holiday visa", "travel visa"])) {
    return { text: "Tourist visa requirements depend on the destination and your circumstances. Sky Bridge can assist with general documentation and application guidance. For a case-specific assessment, you can speak with our counselor.", html: counselorActions(), quick: ["Documents", "Destinations", "Talk to Counselor"] };
  }

  if (hasAny(s, ["work permit", "work visa", "job visa", "employment visa", "work abroad", "working visa"])) {
    return { text: "Sky Bridge provides guidance and application assistance related to work permits. Requirements vary by country and job situation. Would you like to speak with our counselor?", html: counselorActions(), quick: ["Destinations", "Documents", "Talk to Counselor"] };
  }

  if (hasAny(s, ["business visa", "business visit", "commercial visa"])) {
    return { text: "A business visa is generally used for eligible business-related travel, such as meetings or conferences. Requirements vary by destination and purpose. For personalized guidance, please speak with a Sky Bridge counselor.", html: counselorActions(), quick: ["Documents", "Destinations", "Talk to Counselor"] };
  }

  if (hasAny(s, ["family visa", "dependent visa", "dependant visa", "spouse visa", "family permit"])) {
    return { text: "Family and dependent visa requirements depend on the destination, relationship and the primary applicant's status. Exact eligibility should be confirmed for your specific case. Please speak with a Sky Bridge counselor for personalized guidance.", html: counselorActions(), quick: ["Documents", "Destinations", "Talk to Counselor"] };
  }

  if (hasAny(s, ["document", "documents", "paperwork", "required papers", "what do i need", "requirements"])) {
    return { text: "Documents depend on the visa type and destination. Common documents may include a valid passport, photographs, financial documents and supporting documents. Exact requirements should be confirmed for your specific destination.", quick: ["Study Visa", "Tourist Visa", "Work Permit", "Talk to Counselor"] };
  }

  if (hasAny(s, ["processing time", "how long", "how many days", "time take", "processing days", "visa time"])) {
    return { text: "Processing times vary by destination, visa category, application volume and individual circumstances. The relevant immigration authority makes the final decision.", quick: ["Talk to Counselor", "Documents", "Destinations"] };
  }

  if (hasAny(s, ["eligible", "eligibility", "can i apply", "qualification", "qualify", "age limit", "requirements for me"])) {
    return { text: "Eligibility depends on the destination, visa category and your individual circumstances. I can provide general information, but a personalized assessment should be handled by a Sky Bridge counselor.", html: counselorActions(), quick: ["Study Visa", "Tourist Visa", "Work Permit"] };
  }

  if (hasAny(s, ["destination", "destinations", "countries", "which country", "where can i go", "country list"])) {
    return { text: "Sky Bridge can provide general guidance for international visa and travel-related inquiries. Destination-specific requirements can change, so the exact country and visa category should be checked for your case. Tell me the destination you are interested in, or contact our counselor for a case-specific assessment.", html: counselorActions(), quick: ["Work Permit", "Study Visa", "Tourist Visa"] };
  }

  if (hasAny(s, ["visa process", "application process", "how to apply", "apply for visa", "process"] )) {
    return { text: "A typical visa process may involve selecting the correct visa category, checking eligibility, preparing supporting documents, submitting the application and completing any required appointment or biometric steps. The exact process varies by destination and visa type.", html: `<div class="sb-contact-actions">${linkHtml("📞 Talk to Counselor", `tel:${SKY_BRIDGE_CONFIG.counselor.phone}`, true)}</div>`, quick: ["Documents", "Processing Time", "Talk to Counselor"] };
  }

  if (hasAny(s, ["guarantee", "guaranteed", "100 percent", "100%", "sure approval", "visa pakka", "approval guarantee"])) {
    return { text: SKY_BRIDGE_CONFIG.disclaimer, quick: ["Talk to Counselor", "Documents"] };
  }

  if (hasAny(s, ["hello", "hi", "hey", "namaste", "good morning", "good evening", "good afternoon"])) {
    return { text: "Hello! 👋 How can I help you with general visa information today?", quick: QUICK };
  }

  return { text: `I'm sorry, I don't have enough information to answer that accurately.\n\nYou can contact our counselor for personalized guidance:\n\n${SKY_BRIDGE_CONFIG.counselor.name}\n${SKY_BRIDGE_CONFIG.counselor.phoneDisplay}\n\nWould you like to contact a counselor?`, html: counselorActions(), quick: ["Talk to Counselor", "Documents"] };
}

function sendMessage(text) {
  text = text.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";
  setQuickReplies([]);
  showTyping();
  window.setTimeout(() => {
    hideTyping();
    const answer = responseFor(text);
    addMessage(answer.text + (answer.html ? answer.html : ""), "assistant", true);
    setQuickReplies(answer.quick || QUICK);
  }, 450 + Math.random() * 350);
}

function resetChat() {
  messages.innerHTML = "";
  addMessage(WELCOME);
  setQuickReplies();
}

launcher.addEventListener("click", () => chat.classList.contains("open") ? closeChat() : openChat());
el("sb-close").addEventListener("click", closeChat);
el("sb-minimize").addEventListener("click", closeChat);
el("sb-clear").addEventListener("click", resetChat);
form.addEventListener("submit", e => { e.preventDefault(); sendMessage(input.value); });
quickReplies.addEventListener("click", e => { const btn = e.target.closest("[data-quick]"); if (btn) sendMessage(btn.dataset.quick); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && chat.classList.contains("open")) closeChat(); });

resetChat();
