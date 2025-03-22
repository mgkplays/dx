const players = [
    { role: '職位 1', steam16: '1234567890123456', name: '[DX] MGK', shift: 'morning' },
    { role: '職位 2', steam16: '1234567890123456', name: 'Player 2', shift: 'afternoon' },
    { role: '職位 3', steam16: '1234567890123456', name: '[DX] 123', shift: 'evening' },
    { role: '職位 4', steam16: '1234567890123456', name: 'Player 4', shift: 'evening' },
    { role: '職位 5', steam16: '1234567890123456', name: 'Player 5', shift: 'night' },
    { role: '職位 7', steam16: '1234567890123456', name: 'Player 7', shift: 'midnight' },
    { role: '職位 8', steam16: '1234567890123456', name: 'Player 8', shift: 'morning' },
    { role: '職位 9', steam16: '1234567890123456', name: 'Player 9', shift: 'midnight' }
];

document.addEventListener("DOMContentLoaded", function() {
    fetch("data.txt")
        .then(response => response.text())
        .then(text => processText(text))
        .catch(error => console.error("Error loading file:", error));

    setupSidebar();
});

function processText(text) {
    const lines = text.split('\n');
    let currentSender = null;
    let currentAmount = 0;
    let currentTime = null;

    players.forEach(player => {
        player.total = 0;
        player.workingTimeTotal = 0;
        player.nonWorkingTimeTotal = 0;
    });

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith("時間:")) {
            currentTime = line.replace("時間:", "").trim();
        }

        if (line.startsWith("發出:")) {
            currentSender = line.replace("發出:", "").trim();
        }

        if (line.startsWith("數量:") && currentSender && currentTime) {
            currentAmount = parseInt(line.replace("數量:", "").trim(), 10) || 0;
            const currentHour = parseInt(currentTime.split(":")[0], 10);
            
            players.forEach(player => {
                if (player.name === currentSender) {
                    player.total += currentAmount;
                    if (isWithinShift(currentHour, player.shift)) {
                        player.workingTimeTotal += currentAmount;
                    } else {
                        player.nonWorkingTimeTotal += currentAmount;
                    }
                }
            });

            currentSender = null;
            currentTime = null;
        }
    });

    updateTable();
}

function isWithinShift(hour, shift) {
    const shiftHours = {
        "morning": [6, 12],
        "afternoon": [12, 18],
        "evening": [18, 21],
        "night": [21, 24],
        "midnight": [0, 6]
    };
    
    const [start, end] = shiftHours[shift];
    return hour >= start && hour < end;
}

function updateTable() {
    const shifts = {
        "morning": "🌅 早班 (6:00 AM - 12:00 PM)",
        "afternoon": "☀️ 午班 (12:00 PM - 6:00 PM)",
        "evening": "🌆 晚班 (6:00 PM - 9:00 PM)",
        "night": "🌙 小夜班 (9:00 PM - 12:00 AM)",
        "midnight": "🌌 大夜班 (12:00 AM - 6:00 AM)"
    };

    const shiftSections = document.getElementById("shiftSections");
    shiftSections.innerHTML = "";

    Object.keys(shifts).forEach(shift => {
        const shiftPlayers = players.filter(player => player.shift === shift);

        if (shiftPlayers.length > 0) {
            let tableHTML = `
                <div class="shift-section">
                    <h3>${shifts[shift]}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>職位</th>
                                <th>Steam16</th>
                                <th>姓名</th>
                                <th>上班單數</th>
                                <th>非上班單數</th>
                                <th>總數量</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            shiftPlayers.forEach(player => {
                tableHTML += `
                    <tr>
                        <td>${player.role}</td>
                        <td>${player.steam16}</td>
                        <td>${player.name}</td>
                        <td>${player.workingTimeTotal}</td>
                        <td>${player.nonWorkingTimeTotal}</td>
                        <td>${player.total}</td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table></div>`;
            shiftSections.innerHTML += tableHTML;
        }
    });
}

function setupSidebar() {
    const sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    sidebar.innerHTML = `
        <button onclick="openCalculator()">🧮 計算機</button>
    `;
    document.body.appendChild(sidebar);
}

function openCalculator() {
    window.location.href = "calculator.html";
}
