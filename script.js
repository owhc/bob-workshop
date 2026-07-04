/**
 * IBM Bob Workshop 行前準備網頁
 * 分頁切換功能
 */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccessibility();
    initializeSmoothScroll();
    restoreTabState();
});

/**
 * 初始化分頁功能
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab, tabButtons, tabContents);
        });

        // 鍵盤導航支援
        button.addEventListener('keydown', function(e) {
            handleTabKeyboard(e, tabButtons);
        });
    });
}

/**
 * 切換分頁
 * @param {string} targetTab - 目標分頁 ID
 * @param {NodeList} tabButtons - 所有分頁按鈕
 * @param {NodeList} tabContents - 所有分頁內容
 */
function switchTab(targetTab, tabButtons, tabContents) {
    // 移除所有 active 類別
    tabButtons.forEach(btn => btn.classList.remove('tab-btn--active'));
    tabContents.forEach(content => content.classList.remove('tab-panel--active'));

    // 添加 active 類別到目標元素
    const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const activeContent = document.getElementById(targetTab);

    if (activeButton && activeContent) {
        activeButton.classList.add('tab-btn--active');
        activeContent.classList.add('tab-panel--active');

        // 儲存當前分頁狀態
        saveTabState(targetTab);

        // 滾動到頂部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 更新頁面標題
        updatePageTitle(targetTab);

        // 觸發自訂事件
        dispatchTabChangeEvent(targetTab);
    }
}

/**
 * 處理鍵盤導航
 * @param {KeyboardEvent} e - 鍵盤事件
 * @param {NodeList} tabButtons - 所有分頁按鈕
 */
function handleTabKeyboard(e, tabButtons) {
    const currentIndex = Array.from(tabButtons).indexOf(e.target);
    let targetIndex;

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            targetIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
            break;
        case 'ArrowRight':
            e.preventDefault();
            targetIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
            break;
        case 'Home':
            e.preventDefault();
            tabButtons[0].focus();
            tabButtons[0].click();
            break;
        case 'End':
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            tabButtons[tabButtons.length - 1].click();
            break;
    }
}

/**
 * 初始化無障礙功能
 */
function initializeAccessibility() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-panel');

    // 設定 ARIA 屬性
    tabButtons.forEach((button, index) => {
        const tabId = button.getAttribute('data-tab');
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', tabId);
        button.setAttribute('aria-selected', button.classList.contains('tab-btn--active'));
        button.setAttribute('id', `tab-${tabId}`);
    });

    tabContents.forEach(content => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', `tab-${content.id}`);
        content.setAttribute('tabindex', '0');
    });

    // 設定分頁列表容器
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        tabsContainer.setAttribute('role', 'tablist');
    }
}

/**
 * 初始化平滑滾動
 */
function initializeSmoothScroll() {
    // 為所有內部錨點連結添加平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 儲存分頁狀態到 localStorage
 * @param {string} tabId - 分頁 ID
 */
function saveTabState(tabId) {
    try {
        localStorage.setItem('bobWorkshopActiveTab', tabId);
    } catch (e) {
        console.warn('無法儲存分頁狀態:', e);
    }
}

/**
 * 從 localStorage 恢復分頁狀態
 */
function restoreTabState() {
    try {
        const savedTab = localStorage.getItem('bobWorkshopActiveTab');
        if (savedTab) {
            const tabButtons = document.querySelectorAll('.tab-btn');
                const tabContents = document.querySelectorAll('.tab-panel');
            const targetButton = document.querySelector(`[data-tab="${savedTab}"]`);
            
            if (targetButton) {
                switchTab(savedTab, tabButtons, tabContents);
            }
        }
    } catch (e) {
        console.warn('無法恢復分頁狀態:', e);
    }
}

/**
 * 更新頁面標題
 * @param {string} tabId - 分頁 ID
 */
function updatePageTitle(tabId) {
    const titles = {
        'full': 'IBM Bob Workshop 行前準備 - 完整版',
        'quick': 'IBM Bob Workshop 行前準備 - 精簡版',
        'handson': 'IBM Bob Workshop 行前準備 - 帶著動手做'
    };
    
    if (titles[tabId]) {
        document.title = titles[tabId];
    }
}

/**
 * 觸發分頁切換事件
 * @param {string} tabId - 分頁 ID
 */
function dispatchTabChangeEvent(tabId) {
    const event = new CustomEvent('tabChange', {
        detail: { tabId: tabId }
    });
    document.dispatchEvent(event);
}

/**
 * 檢查清單互動功能（選用）
 */
function initializeChecklist() {
    const checklistItems = document.querySelectorAll('.checklist li');
    
    checklistItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
            saveChecklistState();
        });
    });

    // 恢復檢查清單狀態
    restoreChecklistState();
}

/**
 * 儲存檢查清單狀態
 */
function saveChecklistState() {
    try {
        const checkedItems = [];
        document.querySelectorAll('.checklist li.checked').forEach((item, index) => {
            checkedItems.push(index);
        });
        localStorage.setItem('bobWorkshopChecklist', JSON.stringify(checkedItems));
    } catch (e) {
        console.warn('無法儲存檢查清單狀態:', e);
    }
}

/**
 * 恢復檢查清單狀態
 */
function restoreChecklistState() {
    try {
        const savedState = localStorage.getItem('bobWorkshopChecklist');
        if (savedState) {
            const checkedItems = JSON.parse(savedState);
            const checklistItems = document.querySelectorAll('.checklist li');
            checkedItems.forEach(index => {
                if (checklistItems[index]) {
                    checklistItems[index].classList.add('checked');
                }
            });
        }
    } catch (e) {
        console.warn('無法恢復檢查清單狀態:', e);
    }
}

/**
 * 列印功能
 */
function initializePrint() {
    // 監聽列印事件
    window.addEventListener('beforeprint', function() {
        // 列印前顯示所有分頁內容
        document.querySelectorAll('.tab-panel').forEach(content => {
            content.style.display = 'block';
        });
    });

    window.addEventListener('afterprint', function() {
        // 列印後恢復原始狀態
        document.querySelectorAll('.tab-panel').forEach(content => {
            if (!content.classList.contains('tab-panel--active')) {
                content.style.display = 'none';
            }
        });
    });
}

/**
 * 外部連結處理
 */
function initializeExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // 為外部連結添加 target="_blank" 和 rel 屬性
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // 添加視覺提示
            if (!link.querySelector('.external-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-icon';
                icon.innerHTML = ' ↗';
                icon.style.fontSize = '0.8em';
                icon.style.opacity = '0.6';
                link.appendChild(icon);
            }
        }
    });
}

/**
 * 回到頂部按鈕（選用）
 */
function initializeBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', '回到頂部');
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    `;

    document.body.appendChild(backToTopButton);

    // 顯示/隱藏按鈕
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // 點擊回到頂部
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化額外功能（選用）
document.addEventListener('DOMContentLoaded', function() {
    initializePrint();
    initializeExternalLinks();
    initializeBackToTop();
    // initializeChecklist(); // 如需檢查清單互動功能，取消註解此行
});

// 監聽分頁切換事件（示例）
document.addEventListener('tabChange', function(e) {
    console.log('分頁已切換至:', e.detail.tabId);
});

// 導出函數供外部使用（如需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchTab,
        saveTabState,
        restoreTabState
    };
}

// Made with Bob
