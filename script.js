let allElems = document.querySelectorAll('.elem');
let fullElemPage = document.querySelectorAll('.fullElem')
let fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')
allElems.forEach(function(elem){
    elem.addEventListener('click', function(){
        fullElemPage[elem.id].style.display = 'block'
    })
})
fullElemPageBackBtn.forEach(function(back){
    back.addEventListener('click', function(){
        
        fullElemPage[back.id].style.display = 'none'
    })
})

  function updateTime() {
  const now = new Date();

  // Clock with AM/PM
  const time = now.toLocaleTimeString('en-US', { hour12: true });
  document.getElementById('clock').textContent = time;

  // Calculate yesterday, today, tomorrow
  const days = [-1, 0, 1];
  const weekdayBlock = document.getElementById('weekdayBlock');
  weekdayBlock.innerHTML = ''; // Clear before adding again

  days.forEach(offset => {
    const date = new Date();
    date.setDate(now.getDate() + offset);

    const label = date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const div = document.createElement('div');
    div.textContent = label;
    if (offset === 0) div.classList.add('today');

    weekdayBlock.appendChild(div);
  });
}

  setInterval(updateTime, 1000);
  updateTime();

  // Weather function
  async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Please enter a city name.");

  const apiKey = "4d46582fc8e68306f823904f114d730c";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

  document.getElementById('temperature').textContent = "Loading...";

  try {
    const response = await fetch(url + `&appid=${apiKey}`);
    const data = await response.json();

    if (data.main) {
      const temp = data.main.temp.toFixed(1);
      const resultText = `${city}: ${Math.round(temp)}°C`;

      document.getElementById('temperature').textContent = resultText;

      // Save to localStorage
      localStorage.setItem("lastWeather", JSON.stringify({
        city,
        temperature: `${Math.round(temp)}°C`
      }));
    } else {
      document.getElementById('temperature').textContent = "City not found";
    }
  } catch (error) {
    document.getElementById('temperature').textContent = "Error loading";
  }
}

// Load saved weather from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("lastWeather"));
  if (saved) {
    document.getElementById('cityInput').value = saved.city;
    document.getElementById('temperature').textContent = `${saved.city}: ${saved.temperature}`;
  }
});


  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    renderTasks();
  });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);


//to -do lists

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total ? (completed / total) * 100 : 0;
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('statusText').textContent = `${completed} of ${total} tasks completed`;
  }

  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task' + (task.completed ? ' completed' : '');

      // Task header (title + arrow)
      const header = document.createElement('div');
      header.className = 'task-header';

      const title = document.createElement('span');
      title.className = 'task-title';
      title.textContent = task.title;

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.innerHTML = '&#9660;'; // Down arrow ▼

      header.appendChild(title);
      header.appendChild(arrow);

      // Description div
      const desc = document.createElement('div');
      desc.className = 'task-desc';
      desc.textContent = task.description;
      desc.style.display = 'none'; // hide by default

      // Toggle description and rotate arrow on header click
      header.onclick = () => {
        if (desc.style.display === 'none') {
          desc.style.display = 'block';
          arrow.classList.add('rotate');
        } else {
          desc.style.display = 'none';
          arrow.classList.remove('rotate');
        }
      };

      // Actions buttons
      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const completeBtn = document.createElement('button');
      completeBtn.textContent = task.completed ? 'Undo' : 'Mark Complete';
      completeBtn.className = 'complete-btn';
      completeBtn.onclick = () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      editBtn.onclick = () => {
        const newTitle = prompt('Edit title:', task.title);
        if (newTitle === null || newTitle.trim() === '') return;
        const newDesc = prompt('Edit description:', task.description);
        task.title = newTitle.trim();
        task.description = newDesc || '';
        saveTasks();
        renderTasks();
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => {
        if (confirm('Are you sure you want to delete this task?')) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }
      };

      actions.appendChild(completeBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      // Append everything
      taskDiv.appendChild(header);
      if (task.description) taskDiv.appendChild(desc);
      taskDiv.appendChild(actions);

      taskList.appendChild(taskDiv);
    });

    updateProgress();
  }

  function addTask() {
    const titleInput = document.getElementById('titleInput');
    const descInput = document.getElementById('descInput');
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();

    if (!title) {
      alert("Please enter a task title.");
      return;
    }

    tasks.push({ title, description: desc, completed: false });
    saveTasks();
    renderTasks();

    titleInput.value = '';
    descInput.value = '';
  }






function dailyPlanner(){

    let dayPlanner = document.querySelector('.day-planner')
    let dayPlandata =  JSON.parse(localStorage.getItem('dayPlandata')) || {}
    let hours = Array.from({length:18},function(elem,idx){
        return `${6+idx}:00 - ${7+idx}:00`
        
    })
    let wholeDaySum = ''
    hours.forEach(function(elem,idx){
        let savedData = dayPlandata[idx] || ''
        
        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
        <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData    }>
    </div>`
})



dayPlanner.innerHTML = wholeDaySum 
let dayPlannerInput = document.querySelectorAll('.day-planner input')
dayPlannerInput.forEach(function(elem){
    elem.addEventListener('input',function(){
        dayPlandata[elem.id]= elem.value
        
        localStorage.setItem('dayPlandata',JSON.stringify(dayPlandata))
    })
})
}
dailyPlanner()  





        function motivate(){

          const quoteText = document.getElementById('quote-text');
          const quoteAuthor = document.getElementById('quote-author');
          const newQuoteBtn = document.getElementById('new-quote-btn');
          
          async function fetchQuote() {
            try {
              const response = await fetch('https://randominspirationalquotes.onrender.com');
              const data = await response.json();
              
              quoteText.innerText = data.quote;
              quoteAuthor.innerText = `- ${data.author}`;
            } catch (error) {
              quoteText.innerText = "Failed to load quote.";
              quoteAuthor.innerText = "";
              console.error("Error fetching quote:", error);
            }
          }
          
          // Initial load
          fetchQuote();
          
          // Load new quote on button click
          newQuoteBtn.addEventListener('click', fetchQuote);
        }
        motivate()
          
          

        // Pomodomo   

         const timerEl = document.getElementById('timer');
    const statussText = document.getElementById('statussText');
    const ring = document.getElementById('ring-progress');
    const themeSelect = document.getElementById('themeSelect');
    const flipClock = document.querySelector('.flip-clock');
    const headerEl = document.querySelector("h1");

    let sessionDuration = 0;
    let sessionRemaining = 0;
    let isRunning = false;
    let interval = null;

    window.onload = () => {
      const savedFocus = localStorage.getItem("focusTime");
      const savedBreak = localStorage.getItem("breakTime");
      const savedTheme = localStorage.getItem("theme");

      if (savedFocus) document.getElementById('focusInput').value = savedFocus;
      if (savedBreak) document.getElementById('breakInput').value = savedBreak;
      if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
      }
    };

    function formatTime(seconds) {
      const min = Math.floor(seconds / 60).toString().padStart(2, '0');
      const sec = (seconds % 60).toString().padStart(2, '0');
      return `${min}:${sec}`;
    }

    function updateRing(remaining, total) {
      const radius = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (remaining / total) * circumference;
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = offset;
    }

    function applyCustomTime() {
      const focusVal = parseInt(document.getElementById('focusInput').value) || 25;
      const breakVal = parseInt(document.getElementById('breakInput').value) || 5;

      localStorage.setItem("focusTime", focusVal);
      localStorage.setItem("breakTime", breakVal);

      sessionDuration = focusVal * 60;
      sessionRemaining = sessionDuration;
      const formattedTime = formatTime(sessionRemaining);
      statussText.innerText = "Custom Time Set";
      headerEl.innerText = `Pomodoro Timer (${formattedTime})`;
      updateUI();
    }

    function startSession(mins) {
      sessionDuration = mins * 60;
      sessionRemaining = sessionDuration;
      statussText.innerText = "Work Started";
      headerEl.innerText = `Pomodoro Timer (${mins})`;
      updateUI();
    }

    function startBreak() {
      const breakVal = parseInt(document.getElementById('breakInput').value) || 5;
      sessionDuration = breakVal * 60;
      sessionRemaining = sessionDuration;
      statussText.innerText = "Break Time";
      updateUI();
    }

    function startTimer() {
      if (!isRunning && sessionRemaining > 0) {
        isRunning = true;
        statussText.innerText = "Resume";
        interval = setInterval(() => {
          sessionRemaining--;
          updateUI();
          if (sessionRemaining <= 0) {
            clearInterval(interval);
            isRunning = false;
            statussText.innerText = "Session Complete!";
            updateUI();
          }
        }, 1000);
      }
    }

    function pauseTimer() {
      clearInterval(interval);
      isRunning = false;
      statussText.innerText = "Paused";
      updateUI();
    }

    function resetTimer() {
      clearInterval(interval);
      isRunning = false;
      sessionRemaining = sessionDuration;
      statussText.innerText = "Reset";
      updateUI();
    }

    document.getElementById('fullscreenBtn').addEventListener('click', () => {
      const container = document.querySelector('.ring-container');
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const svg = document.querySelector("#progress-ring");
      const timerText = document.getElementById("timer");

      if (document.fullscreenElement) {
        svg.style.display = "none";
        flipClock.style.display = "block";
        timerText.style.display = "none";
      } else {
        svg.style.display = "block";
        flipClock.style.display = "none";
        timerText.style.display = "block";
      }
    });

    // Bind fullscreen control buttons
    document.getElementById("fsStartBtn").addEventListener("click", startTimer);
    document.getElementById("fsPauseBtn").addEventListener("click", pauseTimer);
    document.getElementById("fsResetBtn").addEventListener("click", resetTimer);

    function updateUI() {
      const formattedTime = formatTime(sessionRemaining);
      timerEl.innerText = formattedTime;
      flipClock.innerText = formattedTime;
      updateRing(sessionRemaining, sessionDuration || 1);
      updateDocumentTitle(formattedTime);
    }

    function updateDocumentTitle(timeText) {
      if (statussText.innerText.includes("Work")) {
        document.title = `🕒 ${timeText} – Work Started`;
      } else if (statussText.innerText.includes("Break")) {
        document.title = `🕒 ${timeText} – Break Time`;
      } else if (statussText.innerText === "Paused") {
        document.title = `⏸️ ${timeText} – Paused`;
      } else if (statussText.innerText === "Reset") {
        document.title = `🔁 ${timeText} – Reset`;
      } else if (statussText.innerText === "Session Complete!") {
        document.title = `✅ ${timeText} – Session Complete`;
      } else {
        document.title = `⏳ ${timeText}`;
      }
    }

    themeSelect.addEventListener('change', () => {
      const selectedTheme = themeSelect.value;
      localStorage.setItem("theme", selectedTheme);
      applyTheme(selectedTheme);
    });

    function exitFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }

    function bgSetImage(bgUrl) {
      document.body.style.backgroundImage = `url('${bgUrl}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.color = "#fff";
    }

    function fullScreenImageSet(flipBgUrl) {
      flipClock.style.backgroundImage = `url('${flipBgUrl}')`;
      flipClock.style.backgroundSize = "cover";
      flipClock.style.backgroundPosition = "center";
    }

    function applyTheme(theme) {
      document.body.style.backgroundImage = "";
      flipClock.style.backgroundImage = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.removeAttribute('data-theme');

      switch (theme) {
        
         
        case "image":
          bgSetImage("img/1.png");
          fullScreenImageSet("img/1.png");
          break;
        case "image2":
          bgSetImage("img/2.png");
          fullScreenImageSet("img/2.png");
          break;
        default:
          document.body.style.backgroundColor = "#f7f7f7";
          document.body.style.color = "#000";
      }
    }

    updateUI();