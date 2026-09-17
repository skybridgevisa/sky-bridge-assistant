
// ==================================================
// SKY BRIDGE ASSISTANT CONFIGURATION
// ==================================================
const SKY_BRIDGE_CONFIG = {
  BUSINESS_NAME: "Sky Bridge",
  BUSINESS_EMAIL: "skybridge.migrationoverseas@gmail.com",
  COUNSELOR_NAME: "Zoya Siddiqui",
  COUNSELOR_PHONE: "+91 8796854108",
  CONTACT_PERSON_NAME: "Shayan Malik",
  CONTACT_PERSON_PHONE: "+91 8527841206",
  INTERNATIONAL_CONTACT_NAME: "Cristian Dobrea",
  INTERNATIONAL_CONTACT_PHONE: "+380 63 053 7559",
  DELHI_BRANCH_ADDRESS: "15A, 3rd Floor, Pocket 1, Near HDFC Bank, Mayur Vihar, Delhi – 110091, India"
};

// ==================================================
// SHARED SITE CONFIGURATION
// ==================================================
const cleanPhone = p => String(p).replace(/\D/g, "");
const wa = (phone, text = "") => `https://wa.me/${cleanPhone(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const tel = phone => `tel:${String(phone).replace(/[^\d+]/g,"")}`;
const mail = (email, subject = "") => `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

function bindGlobalActions(){
  document.querySelectorAll("[data-wa-counselor]").forEach(el=>{
    el.href = wa(SKY_BRIDGE_CONFIG.COUNSELOR_PHONE, "Hello Sky Bridge, I would like to speak with a counselor.");
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-wa-international]").forEach(el=>{
    el.href = wa(SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_PHONE, "Hello, I have an international inquiry for Sky Bridge.");
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-call-counselor]").forEach(el=>el.href=tel(SKY_BRIDGE_CONFIG.COUNSELOR_PHONE));
  document.querySelectorAll("[data-wa-contact-person]").forEach(el=>el.href=wa(SKY_BRIDGE_CONFIG.CONTACT_PERSON_PHONE, "Hello Shayan Malik, I would like to contact Sky Bridge."));
  document.querySelectorAll("[data-call-contact-person]").forEach(el=>el.href=tel(SKY_BRIDGE_CONFIG.CONTACT_PERSON_PHONE));
  document.querySelectorAll("[data-call-international]").forEach(el=>el.href=tel(SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_PHONE));
  document.querySelectorAll("[data-email]").forEach(el=>el.href=mail(SKY_BRIDGE_CONFIG.BUSINESS_EMAIL));
  document.querySelectorAll("[data-map]").forEach(el=>{
    el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SKY_BRIDGE_CONFIG.DELHI_BRANCH_ADDRESS);
    el.target="_blank"; el.rel="noopener";
  });
}

function setupMobileNav(){
  const toggle=document.querySelector(".menu-toggle");
  const nav=document.querySelector(".nav-links");
  if(!toggle||!nav) return;
  toggle.addEventListener("click",()=>nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
}

// ==================================================
// CONSULTATION FORM
// ==================================================
function setupConsultationForm(){
  const form=document.querySelector("#consultationForm");
  if(!form) return;
  const success=document.querySelector("#formSuccess");
  const errorFor=(id,msg)=>{
    const node=document.querySelector(`[data-error="${id}"]`);
    if(node){node.textContent=msg;node.style.display=msg?"block":"none";}
  };
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form);
    const name=String(data.get("name")||"").trim();
    const phone=String(data.get("phone")||"").trim();
    const email=String(data.get("email")||"").trim();
    const visa=String(data.get("visa")||"").trim();
    const destination=String(data.get("destination")||"").trim();
    const message=String(data.get("message")||"").trim();
    let valid=true;
    if(!name){errorFor("name","Please enter your full name.");valid=false}else errorFor("name","");
    if(!/^[0-9+\-\s()]{7,20}$/.test(phone)){errorFor("phone","Please enter a valid phone number.");valid=false}else errorFor("phone","");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){errorFor("email","Please enter a valid email address.");valid=false}else errorFor("email","");
    if(!visa){errorFor("visa","Please select a visa type.");valid=false}else errorFor("visa","");
    if(!destination){errorFor("destination","Please enter a preferred destination.");valid=false}else errorFor("destination","");
    if(!valid){if(success)success.style.display="none";return;}
    const text=[
      "Hello Sky Bridge, I would like a consultation.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Visa Type: ${visa}`,
      `Destination: ${destination}`,
      `Message: ${message || "Not provided"}`
    ].join("\n");
    if(success){
      success.textContent="Your enquiry is ready. WhatsApp will open with the details filled in for the counselor.";
      success.style.display="block";
    }
    window.open(wa(SKY_BRIDGE_CONFIG.COUNSELOR_PHONE,text),"_blank","noopener");
  });
}

// ==================================================
// RULE-BASED CHATBOT LOGIC
// ==================================================
function assistantResponse(input){
  const q=input.toLowerCase().trim();
  const disclaimer="Visa approval is solely at the discretion of the relevant government or immigration authority. Sky Bridge provides consultancy and application assistance and does not guarantee visa approval.";
  if(/\b(hello|hi|hey|namaste|good morning|good evening)\b/.test(q))
    return {text:"Hello! 👋 Welcome to Sky Bridge. I can help with general information about visa services, destinations, documents and consultation.",actions:"counselor"};
  if(/study visa|student visa|study abroad/.test(q))
    return {text:"A study visa allows an eligible student to study in another country. Requirements vary by destination and institution. Sky Bridge can provide general guidance regarding documentation and the application process."};
  if(/tourist visa|visit visa|visitor visa|tourism/.test(q))
    return {text:"Tourist visa requirements depend on the destination and your circumstances. Sky Bridge can assist with general documentation and application guidance. For a case-specific assessment, you can speak with our counselor."};
  if(/work permit|work visa|job abroad|overseas job|employment visa/.test(q))
    return {text:"Sky Bridge provides guidance and application assistance related to work permits. Requirements vary by country and job situation. Would you like to speak with our counselor?",actions:"counselor"};
  if(/business visa/.test(q))
    return {text:"A business visa may be used for eligible business-related travel, depending on the destination. Requirements and permitted activities vary. A counselor can review your destination and purpose."};
  if(/family visa|dependent visa|spouse visa|dependant/.test(q))
    return {text:"Family or dependent visa requirements vary by destination, relationship, sponsor status and applicant circumstances. A counselor can provide case-specific guidance."};
  if(/document|documents|paperwork|requirements/.test(q))
    return {text:"Documents depend on the visa type and destination. Common documents may include a valid passport, photographs, financial documents and supporting documents. Exact requirements should be confirmed for your specific destination."};
  if(/processing time|how long|processing take|time.*visa/.test(q))
    return {text:"Processing times vary by destination, visa category, application volume and individual circumstances. The relevant immigration authority makes the final decision."};
  if(/eligible|eligibility|qualification|qualify/.test(q))
    return {text:"General eligibility depends on the destination, visa category and your individual circumstances. For personalized assessment, please contact a Sky Bridge counselor." ,actions:"counselor"};
  if(/refus|reject|rejected|denied/.test(q))
    return {text:"If an application is refused, the next steps depend on the refusal reason and the destination's rules. Sky Bridge can help you understand the available application-assistance options. A government/immigration authority makes the decision." ,actions:"counselor"};
  if(/destination|countries|country|where.*go|canada|uk|united kingdom|australia|usa|germany|new zealand|ireland|moldova|poland/.test(q))
    return {text:"Sky Bridge can provide general guidance for destinations including Canada, the United Kingdom, Australia, USA, Germany, New Zealand, Ireland, Moldova and Poland. Requirements vary by destination."};
  if(/international inquiry|international|cristian|380 63|380630537559/.test(q))
    return {text:`International Inquiry\n${SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_NAME}\n${SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_PHONE}\n\nUse the Call or WhatsApp option below for an international inquiry.`,actions:"international"};
  if(/office|address|branch|mayur vihar|where.*located|location/.test(q))
    return {text:`Head Branch:\n${SKY_BRIDGE_CONFIG.DELHI_BRANCH_ADDRESS}\n\nOther locations:\nChisinau, Moldova 🇲🇩\nPoznan, Poland 🇵🇱\n\nNo street addresses are provided for the other locations.`,actions:"office"};
  if(/shayan|contact person/.test(q))
    return {text:`Contact Person: ${SKY_BRIDGE_CONFIG.CONTACT_PERSON_NAME}\n${SKY_BRIDGE_CONFIG.CONTACT_PERSON_PHONE}\n\nWould you like to contact Shayan Malik?`,actions:"contact-person"};
  if(/counselor|counsellor|contact|phone|call|whatsapp|talk to someone|consult/.test(q))
    return {text:`Counselor: ${SKY_BRIDGE_CONFIG.COUNSELOR_NAME}\n${SKY_BRIDGE_CONFIG.COUNSELOR_PHONE}\n${SKY_BRIDGE_CONFIG.BUSINESS_EMAIL}\n\nWould you like to contact a counselor?`,actions:"counselor"};
  if(/guarantee|guaranteed|100%|approval sure|sure visa/.test(q))
    return {text:disclaimer};
  if(/visa|immigration|application/.test(q))
    return {text:`Sky Bridge provides general visa consultancy and application assistance. Requirements depend on the destination and visa category.\n\n${disclaimer}`,actions:"counselor"};
  return {text:"I'm sorry, I don't have enough information to answer that accurately.\n\nYou can contact our counselor for personalized guidance:\n\nZoya Siddiqui\n+91 8796854108\n\nWould you like to contact a counselor?",actions:"fallback"};
}

function actionHtml(type){
  if(type==="counselor"||type==="fallback")
    return `<div class="chat-contact-actions">
      <a href="${wa(SKY_BRIDGE_CONFIG.COUNSELOR_PHONE,"Hello Sky Bridge, I would like personalized guidance.")}" target="_blank" rel="noopener">💬 WhatsApp Counselor</a>
      <a href="${tel(SKY_BRIDGE_CONFIG.COUNSELOR_PHONE)}">📞 Call Counselor</a>
      <a href="${mail(SKY_BRIDGE_CONFIG.BUSINESS_EMAIL,"Sky Bridge consultation")}" >✉️ Email</a>
    </div>`;
  if(type==="contact-person")
    return `<div class="chat-contact-actions">
      <a href="${wa(SKY_BRIDGE_CONFIG.CONTACT_PERSON_PHONE,"Hello Shayan Malik, I would like to contact Sky Bridge.")}" target="_blank" rel="noopener">💬 WhatsApp Shayan</a>
      <a href="${tel(SKY_BRIDGE_CONFIG.CONTACT_PERSON_PHONE)}">📞 Call Shayan</a>
    </div>`;
  if(type==="international")
    return `<div class="chat-contact-actions">
      <a href="${wa(SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_PHONE,"Hello, I have an international inquiry for Sky Bridge.")}" target="_blank" rel="noopener">💬 WhatsApp</a>
      <a href="${tel(SKY_BRIDGE_CONFIG.INTERNATIONAL_CONTACT_PHONE)}">📞 Call</a>
    </div>`;
  if(type==="office")
    return `<div class="chat-contact-actions"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SKY_BRIDGE_CONFIG.DELHI_BRANCH_ADDRESS)}" target="_blank" rel="noopener">📍 Open Delhi Office Map</a></div>`;
  return "";
}

function setupChatbot(){
  const root=document.querySelector("#sky-chatbot-root");
  if(!root) return;
  root.innerHTML=`
    <button class="chat-launcher" id="chatLauncher" aria-label="Open Sky Bridge Assistant">
      <img src="assets/logo.png" alt="Sky Bridge Assistant">
      <span class="chat-badge" id="chatBadge">1</span>
    </button>
    <section class="chat-window" id="chatWindow" aria-label="Sky Bridge Assistant" role="dialog">
      <header class="chat-header">
        <img src="assets/logo.png" alt="Sky Bridge logo">
        <div class="chat-title"><strong>Sky Bridge Assistant</strong><span>● ONLINE • Visa Support Assistant</span></div>
        <button class="chat-head-btn" id="chatMin" aria-label="Minimize chatbot">−</button>
        <button class="chat-head-btn" id="chatClose" aria-label="Close chatbot">×</button>
      </header>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="quick-replies" id="quickReplies">
        <button>Study Visa</button><button>Tourist Visa</button><button>Work Permit</button>
        <button>Documents</button><button>Destinations</button><button>Talk to Counselor</button>
      </div>
      <div class="chat-tools"><button class="chat-clear" id="chatClear">Clear chat</button></div>
      <form class="chat-input" id="chatForm">
        <input id="chatInput" aria-label="Message" placeholder="Type your question..." autocomplete="off">
        <button class="chat-send" aria-label="Send message">➤</button>
      </form>
    </section>`;
  const launcher=root.querySelector("#chatLauncher"), win=root.querySelector("#chatWindow");
  const messages=root.querySelector("#chatMessages"), badge=root.querySelector("#chatBadge");
  const addMsg=(text,who="assistant",actions="")=>{
    const div=document.createElement("div");div.className=`msg ${who}`;div.textContent=text;
    messages.appendChild(div);
    if(actions){const holder=document.createElement("div");holder.innerHTML=actionHtml(actions);messages.appendChild(holder.firstElementChild);}
    messages.scrollTop=messages.scrollHeight;
  };
  const welcome=()=>addMsg("Hello! 👋 Welcome to Sky Bridge.\n\nI'm the Sky Bridge Assistant. I can help you with general information about our visa services, destinations, documents and consultation process.\n\nHow can I help you today?");
  const openChat=()=>{win.classList.add("open");badge.style.display="none";if(!messages.children.length)welcome();setTimeout(()=>root.querySelector("#chatInput").focus(),50)};
  launcher.addEventListener("click",openChat);
  root.querySelector("#chatClose").addEventListener("click",()=>win.classList.remove("open"));
  root.querySelector("#chatMin").addEventListener("click",()=>win.classList.remove("open"));
  root.querySelector("#chatClear").addEventListener("click",()=>{messages.innerHTML="";welcome()});
  root.querySelectorAll("#quickReplies button").forEach(b=>b.addEventListener("click",()=>send(b.textContent)));
  root.querySelector("#chatForm").addEventListener("submit",e=>{e.preventDefault();send(root.querySelector("#chatInput").value)});
  function send(raw){
    const text=String(raw||"").trim();if(!text)return;
    addMsg(text,"user");root.querySelector("#chatInput").value="";
    const typing=document.createElement("div");typing.className="msg assistant typing";typing.innerHTML="<i></i><i></i><i></i>";messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
    setTimeout(()=>{typing.remove();const r=assistantResponse(text);addMsg(r.text,"assistant",r.actions)},450);
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  bindGlobalActions();
  setupMobileNav();
  setupConsultationForm();
  setupChatbot();
});
