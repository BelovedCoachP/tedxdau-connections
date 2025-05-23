// Game data
const gameData = {
    categories: [
        {
            name: "INNOVATION PIONEERS",
            description: "Speakers driving technological change",
            color: "yellow-category",
            items: [
                { text: "Designed AI-powered learning experiences using game-based simulations", speaker: "Page Durham" },
                { text: "Created acquisition strategies for AI prototype delivery", speaker: "Bonnie Evangelista" },
                { text: "Oversees mechanical fabrication and R&D programs at a leading research lab", speaker: "Jim Blessé" },
                { text: "Manages technology integration for military information warfare", speaker: "MaryLou Moore" }
            ]
        },
        {
            name: "MISSION LEADERS",
            description: "Speakers in key leadership positions",
            color: "green-category",
            items: [
                { text: "Served as commanding officer of a Coast Guard air station", speaker: "Marcus Canady" },
                { text: "Led efforts to overhaul outdated government procurement models", speaker: "Bonnie Evangelista" },
                { text: "Managed Afghan relocation efforts through strategic acquisition contracts", speaker: "Mike Carroll" },
                { text: "Leads cybersecurity innovation within a national security training corps", speaker: "Faith Jones" }
            ]
        },
        {
            name: "EDUCATIONAL JOURNEYS",
            description: "Speakers with specialized educational backgrounds",
            color: "blue-category",
            items: [
                { text: "Earned advanced degrees in systems engineering, political science, and public policy", speaker: "Margaret Palmieri" },
                { text: "Currently pursuing multiple graduate certificates, including entrepreneurship and data engineering", speaker: "Ryan Hilger" },
                { text: "Served in both the classroom and the Pentagon, managing classified military correspondence", speaker: "Latanya Tidwell" },
                { text: "Built cross-service innovation networks in military acquisition", speaker: "Mike Carroll" }
            ]
        },
        {
            name: "TRANSFORMATION CHAMPIONS",
            description: "Speakers leading transformative initiatives",
            color: "purple-category",
            items: [
                { text: "Founded a leadership development company focused on \"intrusive leadership\"", speaker: "Marcus Canady" },
                { text: "Developed submarine-launched autonomous systems programs", speaker: "Ryan Hilger" },
                { text: "Supports transition of warfighting networks through data science and AI integration", speaker: "Margaret Palmieri" },
                { text: "Manages education of 87,000 Airmen in continuous improvement initiatives", speaker: "MaryLou Moore" }
            ]
        }
    ],
    hints: [
        "🟨 EASIEST CATEGORY: Look for clues that mention AI, technology integration, R&D programs, or mechanical fabrication. These speakers are all working directly with cutting-edge technology.",
        "🟩 MEDIUM CATEGORY: Find the clues about people who have held command positions, led major organizational efforts, or managed large-scale operations. Think 'leadership roles.'",
        "🟦 HARDER CATEGORY: Look for clues that specifically mention degrees, certificates, classroom experience, or educational achievements. These are about learning and academic backgrounds.",
        "🟪 HARDEST CATEGORY: Find speakers who have created new programs, founded companies, developed new systems, or transformed how things work. They're all building something new or different.",
        "💡 EXTRA HELP: Some speakers appear in multiple categories! Bonnie Evangelista is both an innovator AND a leader. Margaret Palmieri has educational background AND leads transformation.",
        "🔍 FINAL HINT: If you're stuck, try grouping by keywords: 'AI/technology,' 'commanded/led/managed,' 'degrees/certificates/classroom,' and 'founded/developed/transformation.'"
    ]
};

// Game state
let gameState = {
    selectedItems: [],
    solvedCategories: [],
    hintsUsed: 0,
    maxHints: gameData.hints.length
};

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const submitButton = document.getElementById('submitButton');
const hintButton = document.getElementById('hintButton');
const feedbackElement = document.getElementById('feedback');
const solvedGroupsElement = document.getElementById('solvedGroups');
const completionMessage = document.getElementById('completionMessage');
const hintArea = document.getElementById('hintArea');
const hintContent = document.getElementById('hintContent');
const registerLink = document.getElementById('registerLink');

// Update the registration link
registerLink.href = "https://www.dau.edu/tedxdau";
registerLink.textContent = "Register for TEDxDAU 2025: Driving Change";

// Initialize the game
function initGame() {
    // Flatten all items into a single array
    let allItems = [];
    gameData.categories.forEach(category => {
        category.items.forEach(item => {
            allItems.push({
                ...item,
                categoryName: category.name,
                categoryColor: category.color
            });
        });
    });
    // Shuffle the items
    allItems = shuffleArray(allItems);
    // Create the grid items
    allItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = item.text;
        itemElement.dataset.index = index;
        itemElement.dataset.category = item.categoryName;
        itemElement.dataset.color = item.categoryColor;
        itemElement.dataset.speaker = item.speaker;
        itemElement.addEventListener('click', () => handleItemClick(itemElement));
        gameGrid.appendChild(itemElement);
    });
    // Add event listeners
    submitButton.addEventListener('click', checkSelection);
    hintButton.addEventListener('click', showHint);

    // Ensure the hint button text is correctly set and the button is enabled if hints are available
    if (hintButton) {
        if (gameState.maxHints > 0 && gameState.hintsUsed < gameState.maxHints) { // Check if hints are actually available
            hintButton.textContent = `Get Hint (${gameState.maxHints - gameState.hintsUsed} available)`;
            hintButton.disabled = false; // Explicitly enable
        } else {
            hintButton.textContent = "No More Hints";
            hintButton.disabled = true; // Disable if no hints at all or used up
        }
    }
}

function handleItemClick(item) {
    if (item.classList.contains('solved')) return;
    
    if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        gameState.selectedItems = gameState.selectedItems.filter(i => i !== item.dataset.index);
    } else {
        if (gameState.selectedItems.length < 4) {
            item.classList.add('selected');
            gameState.selectedItems.push(item.dataset.index);
        }
    }
    updateSubmitButton();
}

function updateSubmitButton() {
    submitButton.disabled = gameState.selectedItems.length !== 4;
    submitButton.textContent = `Check Selection (${gameState.selectedItems.length}/4)`;
}

function checkSelection() {
    const selectedElements = gameState.selectedItems.map(index => 
        document.querySelector(`.item[data-index="${index}"]`)
    );
    const selectedCategories = selectedElements.map(el => el.dataset.category);
    const allSameCategory = selectedCategories.every(cat => cat === selectedCategories[0]);
    const categoryAlreadySolved = gameState.solvedCategories.includes(selectedCategories[0]);

    if (allSameCategory && !categoryAlreadySolved) {
        const category = gameData.categories.find(cat => cat.name === selectedCategories[0]);
        selectedElements.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('solved');
            el.classList.add(el.dataset.color);
        });
        gameState.solvedCategories.push(selectedCategories[0]);
        feedbackElement.textContent = `Great job! You found the "${selectedCategories[0]}" category.`;
        feedbackElement.style.color = "#28a745";
        addSolvedGroup(category);
        if (gameState.solvedCategories.length === gameData.categories.length) {
            gameComplete();
        }
    } else if (categoryAlreadySolved) {
        feedbackElement.textContent = `You've already found the "${selectedCategories[0]}" category!`;
        feedbackElement.style.color = "#ffc107";
        selectedElements.forEach(el => el.classList.remove('selected'));
    } else {
        feedbackElement.textContent = "These items don't form a category. Try again!";
        feedbackElement.style.color = "#dc3545";
        selectedElements.forEach(el => {
            el.classList.add('shake');
            setTimeout(() => el.classList.remove('shake'), 500);
        });
    }
    gameState.selectedItems = [];
    updateSubmitButton();
}

function addSolvedGroup(category) {
    const groupElement = document.createElement('div');
    groupElement.className = 'group';
    
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header';
    
    const colorCircle = document.createElement('div');
    colorCircle.className = `group-color ${category.color}`;
    const groupTitle = document.createElement('h3');
    groupTitle.textContent = category.name;
    
    groupHeader.appendChild(colorCircle);
    groupHeader.appendChild(groupTitle);
    
    const groupDescription = document.createElement('p');
    groupDescription.textContent = category.description;
    
    const groupItems = document.createElement('div');
    groupItems.className = 'group-items';
    
    category.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'group-item';
        itemElement.innerHTML = `<strong>${item.text}</strong> - <span class="speaker-link">${item.speaker}</span>`;
        groupItems.appendChild(itemElement);
    });
    groupElement.appendChild(groupHeader);
    groupElement.appendChild(groupDescription);
    groupElement.appendChild(groupItems);
    
    solvedGroupsElement.appendChild(groupElement);
}

function showHint() {
    if (gameState.hintsUsed < gameState.maxHints) {
        const hint = gameData.hints[gameState.hintsUsed];
        hintContent.innerHTML = hint; 
        hintArea.classList.remove('hidden');
        gameState.hintsUsed++;
        
        if (gameState.hintsUsed >= gameState.maxHints) {
            hintButton.disabled = true;
            hintButton.textContent = "No More Hints";
        } else {
            hintButton.textContent = `Get Hint (${gameState.maxHints - gameState.hintsUsed} left)`;
        }
    }
}

function gameComplete() {
    completionMessage.classList.remove('hidden');
    setTimeout(() => completionMessage.scrollIntoView({ behavior: 'smooth' }), 1000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', initGame);
