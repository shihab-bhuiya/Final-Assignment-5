/**
 * Global Architecture App State Variables
 */
let currentFilter = 'All';
let searchQuery = '';
let issuesData = []; // Remote dataset container cache

// Server API Routes Configuration
const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";

/**
 * Capture All Global DOM Reference Tokens
 */
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const issuesGrid = document.getElementById('issues-grid');
const loader = document.getElementById('loader');
const issueCountEl = document.getElementById('issue-count');

const tabAll = document.getElementById('tab-all');
const tabOpen = document.getElementById('tab-open');
const tabClosed = document.getElementById('tab-closed');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const detailModal = document.getElementById('detail-modal');
const closeModalX = document.getElementById('close-modal');
const closeModalBtn = document.getElementById('modal-close-btn');

/**
 * 🔐 Application Authentication Subsystem Manager
 */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    // Verify system credentials constraints rules
    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        fetchIssuesFromServer(); // Request data entries pull pipeline
    } else {
        alert('Invalid credentials entry points! Verify your data matching parameters noted in the dashboard block rules.');
    }
});

/**
 * 📡 Remote Server Network Fetch Async Logic Channels
 */

// 1. Fetch Request Array Handler
async function fetchIssuesFromServer() {
    loader.classList.remove('hidden');
    issuesGrid.innerHTML = '';

    let targetUrl = `${API_BASE}/issues`;

    // Check if active searches context is active to redirect targeted routes endpoints
    if (searchQuery) {
        targetUrl = `${API_BASE}/issues/search?q=${encodeURIComponent(searchQuery)}`;
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Response connection state error failures');

        const data = await response.json();
        // Fallback checks evaluating payload structural differences wrappers formats
        issuesData = Array.isArray(data) ? data : (data.data || []);

        renderFilteredIssues();
    } catch (error) {
        console.error("Critical API Read Exception Event:", error);
        issuesGrid.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white border rounded-2xl shadow-sm px-4">
                <p class="text-red-500 font-semibold mb-1">Sync Latency Block Detected</p>
                <p class="text-slate-400 text-xs">Failed to communicate safely tracking operations records from the live network grid.</p>
            </div>
        `;
    } finally {
        loader.classList.add('hidden'); // Clear active spinning states
    }
}

// 2. Specialized Single-Item Fetch Detail Worker Channel
window.openIssueModal = async function (id) {
    loader.classList.remove('hidden'); // Provide clean interface visual latency blocks indicators
    try {
        const response = await fetch(`${API_BASE}/issue/${id}`);
        if (!response.ok) throw new Error('Single reference item fetch processing error.');

        const result = await response.json();
        const target = result.data || result; // Parse response wrappers structures dynamically

        // Append values parameters matching layout fields components mapping targets references
        document.getElementById('modal-title').textContent = target.title || 'N/A';
        document.getElementById('modal-desc').textContent = target.desc || 'No deeper contextual breakdown fields logs updated.';
        document.getElementById('modal-author').textContent = target.author || 'Anonymous Operator';
        document.getElementById('modal-label').textContent = target.label || 'Default Ticket';
        document.getElementById('modal-priority').textContent = target.priority || 'Normal Severity';
        document.getElementById('modal-date').textContent = target.createdAt ? target.createdAt.split('T')[0] : 'N/A';

        detailModal.classList.remove('hidden');
    } catch (error) {
        console.error("Modal Data Read Error Logs:", error);
        alert("Failed loading details payload data matching selected target ticket index parameters.");
    } finally {
        loader.classList.add('hidden');
    }
};

/**
 * 🎨 Production Standard Cards Render Logic Mapping Architecture
 */
function renderFilteredIssues() {
    // Implement active clients filters mapping structural subsets configurations array lines
    const filtered = issuesData.filter(issue => {
        if (currentFilter === 'All') return true;
        return issue.status?.toLowerCase() === currentFilter.toLowerCase();
    });

    // Write updated counter metrics layout parameters updates values
    issueCountEl.textContent = filtered.length;

    if (filtered.length === 0) {
        issuesGrid.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm">
                No active tracking records items currently matching these sorting criteria.
            </div>
        `;
        return;
    }

    // Build Premium Enterprise Cards elements mapped structure output arrays strings blocks
    issuesGrid.innerHTML = filtered.map(issue => {
        const isClosed = issue.status?.toLowerCase() === 'closed';

        // Dynamic border assignments requirement mapping verification instructions properties
        const borderTopClass = isClosed ? 'border-t-4 border-purple-600' : 'border-t-4 border-emerald-500';
        const badgeStatusClass = isClosed ? 'bg-purple-50 text-purple-700 ring-purple-600/10' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/10';
        const statusText = isClosed ? 'Closed' : 'Open';

        return `
            <div onclick="openIssueModal('${issue.id || issue._id}')" 
                 class="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${borderTopClass} cursor-pointer">
                
                <div>
                    <div class="flex items-center justify-between gap-x-2 mb-3.5">
                        <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeStatusClass}">
                            ${statusText}
                        </span>
                        <span class="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                            ${issue.label || 'Issue'}
                        </span>
                    </div>

                    <h4 class="text-base font-bold leading-6 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        ${issue.title}
                    </h4>
                    <p class="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                        ${issue.desc || 'No descriptive context parameters logged onto core logs repository tags items data structure.'}
                    </p>
                </div>

                <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div class="flex items-center gap-1.5 min-w-0">
                        <div class="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 uppercase tracking-tighter">
                            ${(issue.author || 'U').charAt(0)}
                        </div>
                        <span class="truncate text-slate-600 font-medium">${issue.author || 'Anonymous'}</span>
                    </div>
                    <div class="flex flex-col items-end shrink-0 gap-y-0.5">
                        <span class="font-semibold text-slate-500">Prio: ${issue.priority || 'Medium'}</span>
                        <span class="text-[10px] text-slate-400 font-mono">${issue.createdAt ? issue.createdAt.split('T')[0] : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 🎛️ Navigation Filter Category Tab Controller Engines
 */
function switchActiveTab(selectedTab, category) {
    // Purge previous active configurations visual indicators styles rules mappings elements
    [tabAll, tabOpen, tabClosed].forEach(btn => {
        btn.classList.remove('border-indigo-600', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-slate-500', 'font-medium');
    });

    // Inject selected styling states settings items profiles tags properties
    selectedTab.classList.remove('border-transparent', 'text-slate-500', 'font-medium');
    selectedTab.classList.add('border-indigo-600', 'text-indigo-600', 'font-bold');

    currentFilter = category;
    renderFilteredIssues();
}

tabAll.addEventListener('click', () => switchActiveTab(tabAll, 'All'));
tabOpen.addEventListener('click', () => switchActiveTab(tabOpen, 'Open'));
tabClosed.addEventListener('click', () => switchActiveTab(tabClosed, 'Closed'));

/**
 * 🔍 Input Engine Pipeline Control Events Management Mappings
 */
function executeSearchAction() {
    searchQuery = searchInput.value.trim();
    fetchIssuesFromServer(); // Ping endpoints routes data fetch directly with query properties
}

searchBtn.addEventListener('click', executeSearchAction);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') executeSearchAction();
});

/**
 * 🚪 Structural Modal Dialogues Window State Dismiss Utilities
 */
function closeIssueModal() {
    detailModal.classList.add('hidden');
}

closeModalX.addEventListener('click', closeIssueModal);
closeModalBtn.addEventListener('click', closeIssueModal);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeIssueModal();
});