// Game data
const gameData = {
    categories: [
        {
            name: "INNOVATION PIONEERS", /* */
            description: "Speakers driving technological change", /* */
            color: "yellow-category", /* */
            items: [
                { text: "Designed AI-powered learning experiences using game-based simulations", speaker: "Page Durham" /* */ },
                { text: "Created acquisition strategies for AI prototype delivery", speaker: "Bonnie Evangelista" /* */ },
                { text: "Oversees mechanical fabrication and R&D programs at a leading research lab", speaker: "Jim Blessé" /* */ },
                { text: "Manages technology integration for military information warfare", speaker: "MaryLou Moore" /* */ }
            ]
        },
        {
            name: "MISSION LEADERS", /* */
            description: "Speakers in key leadership positions", /* */
            color: "green-category", /* */
            items: [
                { text: "Served as commanding officer of a Coast Guard air station", speaker: "Marcus Canady" /* */ },
                { text: "Led efforts to overhaul outdated government procurement models", speaker: "Bonnie Evangelista" /* */ },
                { text: "Managed Afghan relocation efforts through strategic acquisition contracts", speaker: "Mike Carroll" /* */ },
                { text: "Leads cybersecurity innovation within a national security training corps", speaker: "Faith Jones" /* */ }
            ]
        },
        {
            name: "EDUCATIONAL JOURNEYS", /* */
            description: "Speakers with specialized educational backgrounds", /* */
            color: "blue-category", /* */
            items: [
                { text: "Earned advanced degrees in systems engineering, political science, and public policy", speaker: "Margaret Palmieri" /* */ },
                { text: "Currently pursuing multiple graduate certificates, including entrepreneurship and data engineering", speaker: "Ryan Hilger" /* */ },
                { text: "Served in both the classroom and the Pentagon, managing classified military correspondence", speaker: "Latanya Tidwell" /* */ },
                { text: "Built cross-service innovation networks in military acquisition", speaker: "Mike Carroll" /* */ }
            ]
        },
        {
            name: "TRANSFORMATION CHAMPIONS", /* */
            description: "Speakers leading transformative initiatives", /* */
            color: "purple-category", /* */
            items: [
                { text: "Founded a leadership development company focused on \"intrusive leadership\"", speaker: "Marcus Canady" /* */ },
                { text: "Developed submarine-launched autonomous systems programs", speaker: "Ryan Hilger" /* */ },
                { text: "Supports transition of warfighting networks through data science and AI integration", speaker: "Margaret Palmieri" /* */ },
                { text: "Manages education of 87,000 Airmen in continuous improvement initiatives", speaker: "MaryLou Moore" /* */ }
            ]
        }
    ],
    hints: [
        "🟨 EASIEST CATEGORY: Look for clues that mention AI, technology integration, R&D programs, or mechanical fabrication. These speakers are all working directly with cutting-edge technology.", /* */ // [cite: 84, 85]
        "🟩 MEDIUM CATEGORY: Find the clues about people who have held command positions, led major organizational efforts, or managed large-scale operations. Think 'leadership roles.'", /* */ // [cite: 85, 86]
        "🟦 HARDER CATEGORY: Look for clues that specifically mention degrees, certificates, classroom experience, or educational achievements. These are about learning and academic backgrounds.", /* */ // [cite: 86, 87]
        "🟪 HARDEST CATEGORY: Find speakers who have created new programs, founded companies, developed new systems, or transformed how things work. They're all building something new or different.", /* */ // [cite: 87, 88]
        "💡 EXTRA HELP: Some speakers appear in multiple categories! Bonnie Evangelista is both an innovator AND a leader. Margaret Palmieri has educational background AND leads transformation.", /* */ // [cite: 88, 89]
        "🔍 FINAL HINT: If you're stuck, try grouping by keywords: 'AI/technology,' 'commanded/led/managed,' 'degrees/certificates/classroom,' and 'founded/developed/transformation.'" /* */ // [cite: 89]
    ]
};

// Game state
let gameState = {
    selectedItems: [], /* */ // [cite: 90]
    solvedCategories: [], /* */ // [cite: 90]
    hintsUsed: 0, /* */ // [cite: 90]
    maxHints: gameData.hints.length /* */ // [cite: 90]
};

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const submitButton = document.getElementById('submitButton');
const hintButton = document.getElementById('hintButton'); // [cite: 90]
const feedbackElement = document.getElementById('feedback'); /* */
const solvedGroupsElement = document.getElementById('solvedGroups');
const completionMessage = document.getElementById('completionMessage');
const hintArea = document.getElementById('hintArea'); /* */
const hintContent = document.getElementById('hintContent'); /* */
const registerLink = document.getElementById('registerLink'); /* */

// Update the registration link
registerLink.href = "https://www.dau.edu/tedxdau"; /* */ // [cite: 92]
registerLink.textContent = "Register for TEDxDAU 2025: Driving Change"; /* */ // [cite: 93]

// Initialize the game
function initGame() {
    // Flatten all items into a single array
    let allItems = []; // [cite: 93]
    gameData.categories.forEach(category => { // [cite: 94]
        category.items.forEach(item => {
            allItems.push({
                ...item,
                categoryName: category.name,
                categoryColor: category.color // [cite: 95]
            });
        });
    });
    // Shuffle the items
    allItems = shuffleArray(allItems); // [cite: 96]
    // Create the grid items
    allItems.forEach((item, index) => { // [cite: 97]
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = item.text;
        itemElement.dataset.index = index;
        itemElement.dataset.category = item.categoryName; /* */ // [cite: 98]
        itemElement.dataset.color = item.categoryColor; /* */ // [cite: 98]
        itemElement.dataset.speaker = item.speaker; /* */ // [cite: 98]
        itemElement.addEventListener('click', () => handleItemClick(itemElement));
        gameGrid.appendChild(itemElement); /* */ // [cite: 99]
    });
    // Add event listeners
    submitButton.addEventListener('click', checkSelection); /* */ // [cite: 100]
    hintButton.addEventListener('click', showHint); /* */ // [cite: 100]

    // Ensure the hint button text is correctly set and the button is enabled if hints are available
    if (hintButton) {
        if (gameState.maxHints > 0) {
            hintButton.textContent = `Get Hint (${gameState.maxHints - gameState.hintsUsed} available)`;
            hintButton.disabled = false; // Explicitly enable
        } else {
            hintButton.textContent = "No More Hints";
            hintButton.disabled = true; // Disable if no hints at all
        }
    }
}

function handleItemClick(item) {
    if (item.classList.contains('solved')) return; /* */
    
    if (item.classList.contains('selected')) {
        item.classList.remove('selected'); /* */
        gameState.selectedItems = gameState.selectedItems.filter(i => i !== item.dataset.index); /* */ // [cite: 103]
    } else {
        if (gameState.selectedItems.length < 4) {
            item.classList.add('selected'); /* */
            gameState.selectedItems.push(item.dataset.index); /* */ // [cite: 104]
        }
    }
    updateSubmitButton(); /* */
}

function updateSubmitButton() {
    submitButton.disabled = gameState.selectedItems.length !== 4; /* */ // [cite: 105]
    submitButton.textContent = `Check Selection (${gameState.selectedItems.length}/4)`; /* */ // [cite: 106]
}

function checkSelection() {
    const selectedElements = gameState.selectedItems.map(index => 
        document.querySelector(`.item[data-index="${index}"]`)
    ); /* */ // [cite: 106]
    const selectedCategories = selectedElements.map(el => el.dataset.category); /* */ // [cite: 107]
    const allSameCategory = selectedCategories.every(cat => cat === selectedCategories[0]); /* */ // [cite: 108]
    const categoryAlreadySolved = gameState.solvedCategories.includes(selectedCategories[0]); /* */ // [cite: 109]

    if (allSameCategory && !categoryAlreadySolved) { /* */ // [cite: 110]
        const category = gameData.categories.find(cat => cat.name === selectedCategories[0]); /* */ // [cite: 111]
        selectedElements.forEach(el => { /* */
            el.classList.remove('selected');
            el.classList.add('solved');
            el.classList.add(el.dataset.color); // [cite: 112]
        });
        gameState.solvedCategories.push(selectedCategories[0]); /* */ // [cite: 113]
        feedbackElement.textContent = `Great job! You found the "${selectedCategories[0]}" category.`; /* */ // [cite: 114, 115]
        feedbackElement.style.color = "#28a745"; /* */ // [cite: 115]
        addSolvedGroup(category); /* */ // [cite: 115]
        if (gameState.solvedCategories.length === gameData.categories.length) { /* */ // [cite: 116]
            gameComplete(); /* */ // [cite: 116]
        }
    } else if (categoryAlreadySolved) { /* */ // [cite: 117]
        feedbackElement.textContent = `You've already found the "${selectedCategories[0]}" category!`; /* */ // [cite: 117]
        feedbackElement.style.color = "#ffc107"; /* */ // [cite: 118]
        selectedElements.forEach(el => el.classList.remove('selected')); /* */ // [cite: 118]
    } else { /* */
        feedbackElement.textContent = "These items don't form a category. Try again!"; /* */ // [cite: 119]
        feedbackElement.style.color = "#dc3545"; /* */ // [cite: 120]
        selectedElements.forEach(el => { /* */
            el.classList.add('shake');
            setTimeout(() => el.classList.remove('shake'), 500); /* */ // [cite: 121]
        });
    }
    gameState.selectedItems = []; /* */ // [cite: 122]
    updateSubmitButton(); /* */ // [cite: 123]
}

function addSolvedGroup(category) {
    const groupElement = document.createElement('div'); /* */ // [cite: 123]
    groupElement.className = 'group'; /* */ // [cite: 124]
    
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header'; /* */
    
    const colorCircle = document.createElement('div');
    colorCircle.className = `group-color ${category.color}`; /* */ // [cite: 124]
    const groupTitle = document.createElement('h3'); /* */ // [cite: 125]
    groupTitle.textContent = category.name; /* */ // [cite: 125]
    
    groupHeader.appendChild(colorCircle);
    groupHeader.appendChild(groupTitle);
    
    const groupDescription = document.createElement('p');
    groupDescription.textContent = category.description;
    
    const groupItems = document.createElement('div'); /* */ // [cite: 125]
    groupItems.className = 'group-items'; /* */ // [cite: 126]
    
    category.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'group-item';
        itemElement.innerHTML = `<strong>${item.text}</strong> - <span class="speaker-link">${item.speaker}</span>`; /* */
        groupItems.appendChild(itemElement); // [cite: 126]
    });
    groupElement.appendChild(groupHeader); /* */ // [cite: 127]
    groupElement.appendChild(groupDescription); /* */ // [cite: 127]
    groupElement.appendChild(groupItems); /* */ // [cite: 127]
    
    solvedGroupsElement.appendChild(groupElement);
}

function showHint() {
    if (gameState.hintsUsed < gameState.maxHints) {
        const hint = gameData.hints[gameState.hintsUsed]; /* */
        hintContent.innerHTML = hint; /* */ // [cite: 128]
        hintArea.classList.remove('hidden'); /* */ // [cite: 128]
        gameState.hintsUsed++; /* */ // [cite: 129]
        
        if (gameState.hintsUsed >= gameState.maxHints) {
            hintButton.disabled = true; /* */ // [cite: 129]
            hintButton.textContent = "No More Hints"; /* */ // [cite: 130]
        } else {
            hintButton.textContent = `Get Hint (${gameState.maxHints - gameState.hintsUsed} left)`; /* */ // [cite: 130]
        }
    }
}

function gameComplete() {
    completionMessage.classList.remove('hidden'); /* */ // [cite: 131]
    setTimeout(() => completionMessage.scrollIntoView({ behavior: 'smooth' }), 1000); /* */ // [cite: 132]
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); /* */ // [cite: 133]
        [array[i], array[j]] = [array[j], array[i]]; /* */ // [cite: 134]
    }
    return array; /* */
}

document.addEventListener('DOMContentLoaded', initGame); /* */ // [cite: 136]
