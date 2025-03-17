// ==UserScript==
// @name         Finviz Sector Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Open Chrome's search bar and copy sector name for Finviz
// @match        https://finviz.com/groups.ashx*
// @grant        GM_xmlhttpRequest
// @connect      finviz.com
// ==/UserScript==

(function() {
    'use strict';
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter Ticker Symbol';
    input.style.margin = '10px';
    document.body.prepend(input);

    // Handle Enter key press
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const ticker = input.value.trim().toUpperCase();
            if (ticker) {
                fetchSectorAndHighlight(ticker);
            }
        }
    });
})();

function fetchSectorAndHighlight(ticker) {
    const url = `https://finviz.com/quote.ashx?t=${ticker}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const sectorElement = doc.querySelector('a.tab-link[title]');
                if (sectorElement) {
                    const sector = sectorElement.textContent.trim();
                    highlightSector(sector);
                    console.log(`Sector for ticker ${ticker}: ${sector}`);
                } else {
                    alert('Sector information not found for ticker: ' + ticker);
                }
            } else {
                alert('Failed to fetch data for ticker: ' + ticker);
            }
        }
    });
}

function highlightSector(sector) {
    // Find or create a message element below the input field
    let messageElement = document.getElementById('sector-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'sector-message';
        messageElement.style.marginTop = '10px';
        messageElement.style.color = 'lightgreen';
        document.body.insertBefore(messageElement, document.body.firstChild.nextSibling);
    }

    // Update the message content
    messageElement.textContent = `Sector "${sector}" copied to clipboard. Press Command + F (or Ctrl + F on Windows) and paste the sector name to search.`;

    // Copy the sector name to the clipboard
    navigator.clipboard.writeText(sector).then(() => {
        console.log(`Sector "${sector}" copied to clipboard.`);
    }).catch(err => {
        console.error('Failed to copy sector to clipboard:', err);
        messageElement.style.color = 'lightred';
        messageElement.textContent = 'Failed to copy sector to clipboard. Please try again.';
    });
}