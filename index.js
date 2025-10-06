// JavaScript for Interactive Birthday Celebration Website
const $ = id => document.getElementById(id);
let sections = ["hero","timeline","secret","fun","end"];
const HEART_INTERVAL_MS = 800;
const HEART_LIFETIME_MS = 3000;
const FIREWORKS_BURSTS = 5;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! CRITICAL: REPLACE "vollyball court" WITH YOUR ACTUAL SECRET CODE !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const CORRECT_CODE = "vollyball court";
let timelineRevealed = false;

// --- Canvas Initialization and Resizing ---
const fCanvas = $('fireworks-canvas');
const fCtx = fCanvas.getContext('2d');
const pCanvas = $('particle-canvas');
const pCtx = pCanvas.getContext('2d');

function setCanvasSize() {
    fCanvas.width = window.innerWidth;
    fCanvas.height = window.innerHeight;
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}

window.addEventListener('resize', setCanvasSize);
setCanvasSize();
// --- End Canvas Initialization ---

function showSection(id){
  sections.forEach(sec=>$ (sec).classList.remove('active'));
  $(id).classList.add('active');

  if (id === 'timeline' && !timelineRevealed) {
      staggerRevealCards();
      timelineRevealed = true;
  }
}

// --- Dynamic Timeline: Intersection Observer Logic ---
const tlTrack = $('tlTrack');
const tlCards = tlTrack.querySelectorAll('.tl-card');

const observerOptions = {
    root: tlTrack,
    rootMargin: '0px -40% 0px -40%',
    threshold: 0.1
};

const timelineObserver = new IntersectionObserver((entries) => {
    tlCards.forEach(card => card.classList.remove('tl-card-active'));
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('tl-card-revealed')) {
            entry.target.classList.add('tl-card-active');
        }
    });
}, observerOptions);

tlCards.forEach(card => {
    timelineObserver.observe(card);
});

function staggerRevealCards() {
    tlCards.forEach((card, index) => {
        const delay = index * 200;
        setTimeout(() => {
            card.classList.add('tl-card-revealed');
        }, delay);
    });
}

// --- Navigation & Triggers ---
$('skipBtn').addEventListener('click', ()=>{
    showSection('timeline');
    // Initial fireworks when starting the celebration
    for(let i=0;i<6;i++){
        setTimeout(()=>launchFire(innerWidth*(0.1+Math.random()*0.8),innerHeight-50),i*250)
    }
});
$('toSurprise').addEventListener('click', ()=>showSection('secret'));
$('toFun').addEventListener('click', ()=>showSection('fun'));
$('toEnd').addEventListener('click', ()=>showSection('end'));

// --- Riddle Logic ---
$('secretForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('secretInput').value.toLowerCase().trim();
  const msg = $('secretMessage');
  const nextBtn = $('toFun');

  if (input === CORRECT_CODE.toLowerCase()) {
    msg.textContent = "Success! Code accepted. ❤️";
    $('surpriseModal').classList.add('show');
    nextBtn.style.display = 'block';
    $('submitCode').style.display = 'none';
  } else {
    msg.textContent = "Incorrect code. Try again, agent. 🧐";
    nextBtn.style.display = 'none';
  }
});

$('closeSurprise').addEventListener('click', ()=> $('surpriseModal').classList.remove('show'));

// --- Final Wish/Celebration Trigger (Calls the single burst function) ---
$('finalWish').addEventListener('click', ()=> {
    // Get the center point of the clickable text element for precise launching
    const rect = $('finalWish').getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Launch a single, massive burst of both confetti and fireworks from the click point
    burstCelebration(centerX, centerY);
});

// --- Custom Toast Function (replaces alert()) ---
let activeToasts = [];
function showToast(message) {
  if (activeToasts.length > 3) {
    activeToasts[0].remove();
    activeToasts.shift();
  }

  const toastContainer = $('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  toastContainer.prepend(toast);
  activeToasts.push(toast);

  setTimeout(() => {
    toast.remove();
    const index = activeToasts.indexOf(toast);
    if (index > -1) activeToasts.splice(index, 1);
  }, 3000);
  return toast;
}

// --- Floating hearts (Quick Hunt) ---
const messages=['You are my destiny 💘','Our love is my favorite story 📖','Forever and a day, my King/Queen 👑','You are the beat in my heart 🥁','I choose you, always 💍'];
setInterval(()=>{
  if(!$('fun').classList.contains('active')) return;
  const heart=document.createElement('div');
  heart.className='heart';
  heart.textContent='❤';
  heart.style.left=Math.random()*85 + 5 +'%';
  heart.style.top='90%';

  let currentToast = null;

  heart.addEventListener('mouseover', (e) => {
      if (!currentToast) {
          const message = messages[Math.floor(Math.random()*messages.length)];
          currentToast = showToast(message);
      }
  });

  heart.addEventListener('mouseleave', () => {
      if (currentToast) {
          currentToast.remove();
          currentToast = null;
      }
  });

  heart.addEventListener('click',()=>{
     if (!currentToast) showToast(messages[Math.floor(Math.random()*messages.length)]);
  });

  $('funArea').appendChild(heart);
  setTimeout(()=>heart.remove(),HEART_LIFETIME_MS);
},HEART_INTERVAL_MS);

// --- Canvas Drawing Logic ---
let fireworks=[];
let confetti = [];
const colors=['255,100,100','100,255,100','100,100,255','255,255,100','255,0,255'];

// Function to launch a single burst of fireworks (used for initial hero transition)
function launchFire(x,y){
  let color=colors[Math.floor(Math.random()*colors.length)];
  for(let i=0;i<80;i++){
    fireworks.push({x,y,dx:(Math.random()-0.5)*7,dy:(Math.random()-0.5)*7,life:40+Math.random()*40,age:0,color, type:'fire'});
  }
}

// **FIXED & COMBINED CELEBRATION FUNCTION**
function burstCelebration(x, y) {
    // 1. Fireworks (Explode outward)
    for(let i = 0; i < 120; i++) {
        let color = colors[Math.floor(Math.random() * colors.length)];
        fireworks.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 8,
            dy: (Math.random() - 0.5) * 8,
            life: 50 + Math.random() * 50,
            age: 0,
            color: color,
            type: 'fire'
        });
    }

    // 2. Confetti (Fall downward/outward)
    for (let i = 0; i < 200; i++) { // Increased count for better visibility
        let confettiColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            dx: (Math.random() - 0.5) * 5, // Increased horizontal spread
            dy: 2 + Math.random() * 5, // Increased initial fall speed
            w: 7 + Math.random() * 7, // 7-14px width
            h: 7 + Math.random() * 10, // 7-17px height
            color: confettiColor,
            type: 'confetti'
        });
    }
}

// **SINGLE, RELIABLE ANIMATION LOOP**
function gameLoop(){

  // --- 1. Clear & Draw Particle Background ---
  pCtx.clearRect(0,0,pCanvas.width,pCanvas.height);
  pCtx.fillStyle='rgba(255,0,0,0.7)';
  for(let p of particles){
    pCtx.beginPath();pCtx.arc(p.x,p.y,2,0,Math.PI*2);pCtx.fill();
    p.y-=p.dy;if(p.y<0){p.y=pCanvas.height; p.x=Math.random()*pCanvas.width;}
  }

  // --- 2. Clear & Draw Fireworks/Confetti Canvas ---
  fCtx.clearRect(0,0,fCanvas.width,fCanvas.height);

  // A. Update and Draw Fireworks
  for(let i=fireworks.length-1;i>=0;i--){
    let p=fireworks[i];
    p.age++;p.x+=p.dx;p.y+=p.dy;p.dy+=0.03;
    let alpha=1-p.age/p.life;
    fCtx.fillStyle=`rgba(${p.color},${alpha})`;
    fCtx.beginPath();p.y>0 && fCtx.arc(p.x,p.y,2,0,Math.PI*2);fCtx.fill();
    if(p.age>p.life)fireworks.splice(i,1);
  }

  // B. Update and Draw Confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    let c = confetti[i];
    c.x += c.dx;
    c.y += c.dy;
    c.dy += 0.02; // Increased gravity for noticeable fall

    fCtx.fillStyle = `rgba(${c.color}, 0.9)`;
    fCtx.fillRect(c.x, c.y, c.w, c.h);

    if (c.y > fCanvas.height) {
        confetti.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

// --- Particle Initialization (Must happen before gameLoop starts) ---
let particles=[];
for(let i=0;i<100;i++) particles.push({x:Math.random()*pCanvas.width,y:pCanvas.height+Math.random()*pCanvas.height,dy:1+Math.random()*1.5});

// Start the single, merged animation loop
gameLoop();