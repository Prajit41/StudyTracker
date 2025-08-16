// Study Helper Toolkit - Main JavaScript File
// This file handles all the interactive functionality for the study helper app

// Global Variables and State Management
let timerInterval = null;
let timerRunning = false;
let currentTime = 25 * 60; // Default 25 minutes in seconds
let isBreakTime = false;

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize all components of the application
 * This function sets up event listeners and loads saved data
 */
function initializeApp() {
    // Load saved theme preference
    loadTheme();
    
    // Load saved data from localStorage
    loadTodos();
    loadGoals();
    loadCountdowns();
    loadNotes();
    
    // Set up event listeners
    setupEventListeners();
    
    // Display initial motivational quote
    displayRandomQuote();
    
    // Update countdown displays
    updateCountdownDisplays();
    
    // Start countdown update interval (updates every minute)
    setInterval(updateCountdownDisplays, 60000);
}

/**
 * Set up all event listeners for interactive elements
 */
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // To-Do List Events
    document.getElementById('addTodoBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    
    // Goals Events
    document.getElementById('addGoalBtn').addEventListener('click', addGoal);
    document.getElementById('goalInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addGoal();
    });
    
    // Countdown Events
    document.getElementById('addCountdownBtn').addEventListener('click', addCountdown);
    
    // Timer Events
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    
    // Notes Events
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('clearNotesBtn').addEventListener('click', clearNotes);
    
    // Quotes Events
    document.getElementById('newQuoteBtn').addEventListener('click', displayRandomQuote);
}

// ======================
// THEME MANAGEMENT
// ======================

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

/**
 * Load saved theme preference from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ======================
// TO-DO LIST FUNCTIONALITY
// ======================

/**
 * Add a new task to the to-do list
 */
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const taskText = todoInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Simple ID generation using timestamp
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Get existing tasks from localStorage
    const todos = getTodos();
    todos.push(task);
    
    // Save to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // Clear input and refresh display
    todoInput.value = '';
    loadTodos();
}

/**
 * Load and display all todos from localStorage
 */
function loadTodos() {
    const todos = getTodos();
    const todoList = document.getElementById('todoList');
    
    // Clear existing list
    todoList.innerHTML = '';
    
    // Add each todo to the display
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑️</button>
        `;
        
        todoList.appendChild(li);
    });
}

/**
 * Toggle the completion status of a todo item
 */
function toggleTodo(id) {
    const todos = getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex !== -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    }
}

/**
 * Delete a todo item
 */
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        const todos = getTodos().filter(todo => todo.id !== id);
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    }
}

/**
 * Get todos from localStorage
 */
function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}

// ======================
// DAILY GOALS FUNCTIONALITY
// ======================

/**
 * Add a new daily goal
 */
function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = goalInput.value.trim();
    
    if (goalText === '') {
        alert('Please enter a goal!');
        return;
    }
    
    // Create goal object
    const goal = {
        id: Date.now(),
        text: goalText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Get existing goals from localStorage
    const goals = getGoals();
    goals.push(goal);
    
    // Save to localStorage
    localStorage.setItem('goals', JSON.stringify(goals));
    
    // Clear input and refresh display
    goalInput.value = '';
    loadGoals();
    updateProgressBar();
}

/**
 * Load and display all goals from localStorage
 */
function loadGoals() {
    const goals = getGoals();
    const goalsList = document.getElementById('goalsList');
    
    // Clear existing list
    goalsList.innerHTML = '';
    
    // Add each goal to the display
    goals.forEach(goal => {
        const li = document.createElement('li');
        li.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                   onchange="toggleGoal(${goal.id})">
            <span>${goal.text}</span>
            <button class="delete-btn" onclick="deleteGoal(${goal.id})">🗑️</button>
        `;
        
        goalsList.appendChild(li);
    });
    
    updateProgressBar();
}

/**
 * Toggle the completion status of a goal
 */
function toggleGoal(id) {
    const goals = getGoals();
    const goalIndex = goals.findIndex(goal => goal.id === id);
    
    if (goalIndex !== -1) {
        goals[goalIndex].completed = !goals[goalIndex].completed;
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals();
    }
}

/**
 * Delete a goal
 */
function deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        const goals = getGoals().filter(goal => goal.id !== id);
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals();
    }
}

/**
 * Update the progress bar based on completed goals
 */
function updateProgressBar() {
    const goals = getGoals();
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.completed).length;
    
    const progressPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${progressPercentage}% Complete (${completedGoals}/${totalGoals})`;
}

/**
 * Get goals from localStorage
 */
function getGoals() {
    return JSON.parse(localStorage.getItem('goals') || '[]');
}

// ======================
// EXAM COUNTDOWN FUNCTIONALITY
// ======================

/**
 * Add a new exam countdown
 */
function addCountdown() {
    const examNameInput = document.getElementById('examName');
    const examDateInput = document.getElementById('examDate');
    
    const examName = examNameInput.value.trim();
    const examDate = examDateInput.value;
    
    if (examName === '' || examDate === '') {
        alert('Please enter both exam name and date!');
        return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Please select a future date!');
        return;
    }
    
    // Create countdown object
    const countdown = {
        id: Date.now(),
        name: examName,
        date: examDate,
        createdAt: new Date().toISOString()
    };
    
    // Get existing countdowns from localStorage
    const countdowns = getCountdowns();
    countdowns.push(countdown);
    
    // Save to localStorage
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    
    // Clear inputs and refresh display
    examNameInput.value = '';
    examDateInput.value = '';
    loadCountdowns();
}

/**
 * Load and display all countdowns from localStorage
 */
function loadCountdowns() {
    const countdowns = getCountdowns();
    const countdownList = document.getElementById('countdownList');
    
    // Clear existing list
    countdownList.innerHTML = '';
    
    // Add each countdown to the display
    countdowns.forEach(countdown => {
        const li = document.createElement('li');
        li.className = 'countdown-item';
        
        const daysLeft = calculateDaysLeft(countdown.date);
        const isUrgent = daysLeft <= 7 && daysLeft >= 0;
        
        li.innerHTML = `
            <div class="countdown-info">
                <div class="countdown-name">${countdown.name}</div>
                <div class="countdown-days ${isUrgent ? 'urgent' : ''}">${getDaysLeftText(daysLeft)}</div>
            </div>
            <button class="delete-btn" onclick="deleteCountdown(${countdown.id})">🗑️</button>
        `;
        
        countdownList.appendChild(li);
    });
}

/**
 * Calculate days left until exam date
 */
function calculateDaysLeft(examDate) {
    const today = new Date();
    const exam = new Date(examDate);
    const timeDiff = exam.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Get formatted text for days left
 */
function getDaysLeftText(daysLeft) {
    if (daysLeft < 0) {
        return `${Math.abs(daysLeft)} days ago`;
    } else if (daysLeft === 0) {
        return 'Today!';
    } else if (daysLeft === 1) {
        return 'Tomorrow!';
    } else {
        return `${daysLeft} days left`;
    }
}

/**
 * Update all countdown displays (called periodically)
 */
function updateCountdownDisplays() {
    loadCountdowns();
}

/**
 * Delete a countdown
 */
function deleteCountdown(id) {
    if (confirm('Are you sure you want to delete this countdown?')) {
        const countdowns = getCountdowns().filter(countdown => countdown.id !== id);
        localStorage.setItem('countdowns', JSON.stringify(countdowns));
        loadCountdowns();
    }
}

/**
 * Get countdowns from localStorage
 */
function getCountdowns() {
    return JSON.parse(localStorage.getItem('countdowns') || '[]');
}

// ======================
// POMODORO TIMER FUNCTIONALITY
// ======================

/**
 * Start the Pomodoro timer
 */
function startTimer() {
    if (!timerRunning) {
        // If timer is reset, get the custom duration
        if (currentTime === 0 || currentTime === 25 * 60 || currentTime === 5 * 60) {
            const studyMinutes = parseInt(document.getElementById('studyMinutes').value) || 25;
            const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 5;
            
            if (!isBreakTime) {
                currentTime = studyMinutes * 60;
            } else {
                currentTime = breakMinutes * 60;
            }
        }
        
        timerRunning = true;
        
        timerInterval = setInterval(() => {
            currentTime--;
            updateTimerDisplay();
            
            if (currentTime <= 0) {
                timerComplete();
            }
        }, 1000);
        
        // Update button states
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
}

/**
 * Pause the timer
 */
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        
        // Update button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
}

/**
 * Reset the timer
 */
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    
    // Reset to study time
    const studyMinutes = parseInt(document.getElementById('studyMinutes').value) || 25;
    currentTime = studyMinutes * 60;
    isBreakTime = false;
    
    updateTimerDisplay();
    
    // Update button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}

/**
 * Play timer sound effect
 */
function playTimerSound() {
    const timerSound = document.getElementById('timerSound');
    if (timerSound) {
        timerSound.currentTime = 0; // Rewind to start
        timerSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

/**
 * Show timer notification
 */
function showTimerNotification(message) {
    // Browser notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: message,
            icon: 'https://cdn-icons-png.flaticon.com/512/3209/3209260.png'
        });
    }
    
    // Visual alert
    const timerCircle = document.querySelector('.timer-circle');
    timerCircle.style.animation = 'pulse 1s infinite';
    
    // Stop pulsing after 5 seconds
    setTimeout(() => {
        timerCircle.style.animation = '';
    }, 5000);
}

/**
 * Handle timer completion
 */
function timerComplete() {
    clearInterval(timerInterval);
    timerRunning = false;
    
    // Play sound
    playTimerSound();
    
    // Show completion notification
    let message = '';
    if (!isBreakTime) {
        message = '🎉 Study session complete! Time for a break!';
        isBreakTime = true;
        const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 5;
        currentTime = breakMinutes * 60;
    } else {
        message = '🔄 Break time is over! Ready for another study session?';
        isBreakTime = false;
        const studyMinutes = parseInt(document.getElementById('studyMinutes').value) || 25;
        currentTime = studyMinutes * 60;
    }
    
    // Show notification
    showTimerNotification(message);
    
    // Update display
    updateTimerDisplay();
    
    // Update button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}

/**
 * Update the timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timerText').textContent = timeString;
    
    // Change colors based on timer type
    const timerCircle = document.querySelector('.timer-circle');
    if (isBreakTime) {
        timerCircle.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    } else {
        timerCircle.style.background = 'linear-gradient(45deg, var(--accent-color), #5ba3f5)';
    }
}

// ======================
// NOTES FUNCTIONALITY
// ======================

/**
 * Save notes to localStorage
 */
function saveNotes() {
    const notesArea = document.getElementById('notesArea');
    const notesContent = notesArea.value;
    
    localStorage.setItem('notes', notesContent);
    alert('Notes saved successfully!');
}

/**
 * Clear all notes
 */
function clearNotes() {
    if (confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
        document.getElementById('notesArea').value = '';
        localStorage.removeItem('notes');
        alert('Notes cleared!');
    }
}

/**
 * Load saved notes from localStorage
 */
function loadNotes() {
    const savedNotes = localStorage.getItem('notes') || '';
    document.getElementById('notesArea').value = savedNotes;
}

// ======================
// MOTIVATIONAL QUOTES FUNCTIONALITY
// ======================

/**
 * Array of motivational quotes for students
 */
const motivationalQuotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It always seems impossible until it's done.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Study hard, dream big, and never give up!",
    "Every expert was once a beginner. Every pro was once an amateur.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for."
];

/**
 * Display a random motivational quote
 */
function displayRandomQuote() {
    const quoteText = document.getElementById('quoteText');
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const selectedQuote = motivationalQuotes[randomIndex];
    
    // Add a fade effect when changing quotes
    quoteText.style.opacity = 0;
    
    setTimeout(() => {
        quoteText.textContent = `"${selectedQuote}"`;
        quoteText.style.opacity = 1;
    }, 150);
}

// ======================
// ANIMATIONS
// ======================

// Add pulsing animation for timer completion
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7); }
        70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
    }
`;
document.head.appendChild(style);

// ======================
// UTILITY FUNCTIONS
// ======================

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Show notification (for browsers that support it)
 */
function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '📚'
        });
    }
}

// Request notification permission when the page loads
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize button states on load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pauseBtn').disabled = true;
});
