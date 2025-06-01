// ==UserScript==
// @name         TradingView Note Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a button to textarea fields on trading.com/chart/** to generate summaries
// @match        https://www.tradingview.com/chart/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createPopup() {
        document.querySelector('#custom-popup')?.remove(); // Remove existing popup if any

        let popup = document.createElement('div');
        popup.id = 'custom-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#fff';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '10000';
        popup.style.width = '280px';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.color = '#000';

        popup.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px;">
                <strong style="font-size: 16px;">Trade Summary</strong>
                <button id="close-popup" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #999;">✖</button>
            </div>

            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 10px;">
                <label><input type="radio" name="trade-type" value="open" checked> Open</label>
                <label><input type="radio" name="trade-type" value="close"> Close</label>
            </div>

            <div id="open-fields">
                <label>ADR: <input type="text" id="adr-input" class="styled-input"></label><br>
                <label>LoD: <input type="text" id="lod-input" class="styled-input"></label><br>
                <label><input type="checkbox" id="checkbox-volume"> High Volume</label><br>
                <label><input type="checkbox" id="checkbox-ema"> Holding 20EMA</label><br>
                <label><input type="checkbox" id="checkbox-sector"> Strong Sector</label><br>
                <label><input type="checkbox" id="checkbox-lower-highs"> Building Lower Highs</label><br>
                <label>Rating: 
                    <span id="rating-picker">
                        <span class="star" data-value="1">★</span>
                        <span class="star" data-value="2">★</span>
                        <span class="star" data-value="3">★</span>
                        <span class="star" data-value="4">★</span>
                    </span>
                </label>
                <br>
            </div>

            <div id="close-fields" style="display: none;">
                <label>Size: <input type="text" id="size-input" class="styled-input"></label><br>
                <label><input type="radio" name="close-type" value="stop-loss" checked> Stop Loss</label>
                <label><input type="radio" name="close-type" value="take-profit"> Take Profit</label><br>
                <div id="stop-loss-fields">
                    <label><input type="radio" name="stop-loss-reason" value="lod" checked> LOD</label><br>
                    <label><input type="radio" name="stop-loss-reason" value="trendline"> Trendline</label><br>
                    <label><input type="radio" name="stop-loss-reason" value="10ema"> 10EMA</label><br>
                    <label><input type="radio" name="stop-loss-reason" value="21ema"> 21EMA</label><br>
                    <label><input type="radio" name="stop-loss-reason" value="breakeven"> Breakeven</label><br>
                </div>
                <div id="take-profit-fields" style="display: none;">
                    <label><input type="checkbox" id="checkbox-critical-price"> Critical Price Level</label><br>
                    <label>Percentage: <input type="text" id="percentage-input" class="styled-input"></label><br>
                </div>
            </div>

            <br>
            <button id="done-popup" class="styled-button">Done</button>
        `;

        document.body.appendChild(popup);

        function escListener(e) {
            if (e.key === "Escape") {
                popup.remove();
                document.removeEventListener('keydown', escListener);
            }
        }
        document.addEventListener('keydown', escListener);

        // Style input fields
        document.querySelectorAll('.styled-input').forEach(input => {
            input.style.width = '100px';
            input.style.padding = '5px';
            input.style.margin = '5px 0';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '5px';
            input.style.fontSize = '14px';
            input.style.background = '#fff';
            input.style.color = '#000';
        });

        // Style checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.style.marginRight = '5px';
        });

        // Style buttons
        document.querySelectorAll('.styled-button').forEach(button => {
            button.style.background = '#4CAF50';
            button.style.color = 'white';
            button.style.padding = '8px 12px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.width = '100%';
            button.style.fontSize = '14px';
            button.style.marginTop = '10px';
            button.style.transition = 'background 0.3s';
        });

        document.getElementById('close-popup').addEventListener('click', () => popup.remove());

        function updateFields() {
            let isOpen = document.querySelector('input[name="trade-type"]:checked').value === 'open';
            document.getElementById('open-fields').style.display = isOpen ? 'block' : 'none';
            document.getElementById('close-fields').style.display = isOpen ? 'none' : 'block';
        }

        function updateCloseFields() {
            let isStopLoss = document.querySelector('input[name="close-type"]:checked').value === 'stop-loss';
            document.getElementById('stop-loss-fields').style.display = isStopLoss ? 'block' : 'none';
            document.getElementById('take-profit-fields').style.display = isStopLoss ? 'none' : 'block';
        }

        document.querySelectorAll('input[name="trade-type"]').forEach(radio => {
            radio.addEventListener('change', updateFields);
        });

        document.querySelectorAll('input[name="close-type"]').forEach(radio => {
            radio.addEventListener('change', updateCloseFields);
        });

        // Add styles for the rating picker
        document.querySelectorAll('.star').forEach(star => {
            star.style.cursor = 'pointer';
            star.style.fontSize = '20px';
            star.style.color = '#ccc';
            star.addEventListener('mouseover', function() {
                let value = parseInt(this.dataset.value);
                document.querySelectorAll('.star').forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= value ? '#FFD700' : '#ccc';
                });
            });
            star.addEventListener('click', function() {
                let value = parseInt(this.dataset.value);
                document.getElementById('rating-picker').dataset.selectedRating = value;
                document.querySelectorAll('.star').forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= value ? '#FFD700' : '#ccc';
                });
            });
        });

        document.getElementById('done-popup').addEventListener('click', function() {
            let tradeType = document.querySelector('input[name="trade-type"]:checked').value;

            let summary = `🔹 ${tradeType.toUpperCase()}\n`;

            if (tradeType === 'open') {
                let adr = document.getElementById('adr-input').value || 'N/A';
                let lod = document.getElementById('lod-input').value || 'N/A';

                let highVolume = document.getElementById('checkbox-volume').checked ? '✅ High Volume' : '❌ High Volume';
                let holding20EMA = document.getElementById('checkbox-ema').checked ? '✅ Holding 20EMA' : '❌ Holding 20EMA';
                let strongSector = document.getElementById('checkbox-sector').checked ? '✅ Strong Sector' : '❌ Strong Sector';
                let lowerHighs = document.getElementById('checkbox-lower-highs').checked ? '✅ Building Lower Highs' : '❌ Building Lower Highs';

                let rating = document.getElementById('rating-picker').dataset.selectedRating || '0';
                let emojiStars = '⭐'.repeat(parseInt(rating));

                summary += `ADR: ${adr}\nLoD: ${lod}\n${highVolume}\n${holding20EMA}\n${strongSector}\n${lowerHighs}\nRating: ${emojiStars || 'N/A'}`;
            } else {
                let size = document.getElementById('size-input').value || 'N/A';
                let closeType = document.querySelector('input[name="close-type"]:checked').value;

                summary += `Size: ${size}\n${closeType.toUpperCase()}\n`;

                if (closeType === 'stop-loss') {
                    let stopLossReason = document.querySelector('input[name="stop-loss-reason"]:checked').value;

                    summary += `Stop Loss Reason: ${stopLossReason}`;
                } else {
                    let criticalPrice = document.getElementById('checkbox-critical-price').checked ? '✅ Critical Price Level' : '❌ Critical Price Level';
                    let percentage = document.getElementById('percentage-input').value || 'N/A';

                    summary += `${criticalPrice}\nPercentage: ${percentage}`;
                }
            }

            navigator.clipboard.writeText(summary.trim()).then(() => {
                document.getElementById('done-popup').textContent = '✔ Done';
                setTimeout(() => popup.remove(), 1000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });

        updateFields();
        updateCloseFields();
    }

    function createIndustryPopup() {
        document.querySelector('#industry-popup')?.remove();

        let popup = document.createElement('div');
        popup.id = 'industry-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#fff';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '10001';
        popup.style.width = '320px';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.color = '#000';

        popup.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px;">
                <strong style="font-size: 16px;">Industry Rank Lookup</strong>
                <button id="close-industry-popup" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #999;">✖</button>
            </div>
            <input id="industry-input" type="text" placeholder="Type symbol or industry..." style="width: 90%; padding: 6px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; margin-bottom: 10px;">
            <div id="industry-result" style="margin-top: 10px; min-height: 30px;"></div>
        `;

        document.body.appendChild(popup);

        function escListenerIndustry(e) {
            if (e.key === "Escape") {
                popup.remove();
                document.removeEventListener('keydown', escListenerIndustry);
            }
        }
        document.addEventListener('keydown', escListenerIndustry);

        document.getElementById('close-industry-popup').onclick = () => popup.remove();

        let input = document.getElementById('industry-input');
        let resultDiv = document.getElementById('industry-result');

        // Spinner CSS
        let spinner = document.createElement('div');
        spinner.id = 'industry-spinner';
        spinner.style.display = 'none';
        spinner.innerHTML = `<div style="display: flex; justify-content: center; align-items: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite;"></div>
        </div>
        <style>
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        </style>`;
        resultDiv.appendChild(spinner);

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && input.value.trim()) {
                resultDiv.textContent = '';
                spinner.style.display = 'block';
                resultDiv.appendChild(spinner);

                const url = `https://1qorxqru4k.execute-api.us-east-1.amazonaws.com/dev/industry/${encodeURIComponent(input.value.trim())}`;
                console.log('[Industry Lookup] Fetching:', url);

                fetch(url, {
                    headers: { "x-api-key": "xxxxx" }
                })
                .then(r => {
                    console.log('[Industry Lookup] Response status:', r.status);
                    return r.json();
                })
                .then(data => {
                    console.log('[Industry Lookup] Response data:', data);
                    spinner.style.display = 'none';
                    if (data && data.message && data.industry) {
                        // Create hyperlink for industry
                        const industry = data.industry;
                        const industryParam = industry.toLowerCase().replace(/\s+/g, '');
                        const finvizUrl = `https://finviz.com/screener.ashx?v=141&f=ind_${industryParam}&o=-volume`;
                        const msg = `${industry} - ${data.message}`;

                        // Set HTML with hyperlink
                        resultDiv.innerHTML = `<a href="${finvizUrl}" target="_blank" style="color:#1976d2;text-decoration:underline;">${industry}</a> - ${data.message}`;

                        // Copy plain text (with URL) to clipboard
                        navigator.clipboard.writeText(`${industry} (${finvizUrl}) - ${data.message}`);
                    } else {
                        resultDiv.textContent = 'No data found.';
                        console.log('[Industry Lookup] No data found:', data);
                    }
                })
                .catch(err => {
                    spinner.style.display = 'none';
                    resultDiv.textContent = 'Error fetching data.';
                    console.error('[Industry Lookup] Fetch error:', err);
                });
            }
        });
    }

    function addButtonToTextarea() {
        let textarea = document.querySelector('.textarea-x5KHDULU');
        if (!textarea || textarea.dataset.hasButton) return;

        let button = document.createElement('button');
        button.textContent = '➕';
        button.style.position = 'absolute';
        button.style.top = '5px';
        button.style.right = '5px';
        button.style.background = '#f0f0f0';
        button.style.color = '#333';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.padding = '3px 6px';
        button.style.fontSize = '14px';
        button.style.zIndex = '9999';

        // New question mark button
        let qButton = document.createElement('button');
        qButton.textContent = '❓';
        qButton.title = 'Industry Rank Lookup';
        qButton.style.position = 'absolute';
        qButton.style.top = '5px';
        qButton.style.right = '35px';
        qButton.style.background = '#f0f0f0';
        qButton.style.color = '#333';
        qButton.style.border = '1px solid #ccc';
        qButton.style.borderRadius = '4px';
        qButton.style.cursor = 'pointer';
        qButton.style.padding = '3px 6px';
        qButton.style.fontSize = '14px';
        qButton.style.zIndex = '9999';

        let container = textarea.closest('.container-WDZ0PRNh');
        if (container) {
            container.style.position = 'relative';
            container.appendChild(qButton);
            container.appendChild(button);
        }

        textarea.dataset.hasButton = 'true';

        button.addEventListener('click', createPopup);
        qButton.addEventListener('click', createIndustryPopup);
    }

    setInterval(addButtonToTextarea, 1000);
})();