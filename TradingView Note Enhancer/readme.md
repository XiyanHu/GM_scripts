
# TradingView Note Enhancer

## Overview

The **TradingView Note Enhancer** is a Tampermonkey userscript that adds a button to textarea fields on TradingView charts. This button opens a popup to help you generate trade summaries quickly and efficiently.

## Features

- Adds a button (`➕`) to textarea fields on TradingView charts.
- Opens a popup to input trade details.
- Supports both **Open** and **Close** trade types.
- Automatically copies the generated trade summary to the clipboard.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Copy the script from [`tradingview_note_enhancer.user.js`](tradingview_note_enhancer.user.js).
3. Create a new script in Tampermonkey and paste the code.
4. Save the script.

## Usage

1. Open a chart on [TradingView](https://www.tradingview.com/chart/).
2. Locate the textarea field where you want to add notes.
3. Click the `➕` button that appears in the top-right corner of the textarea.
4. Fill in the details in the popup:
   - **Open Trade**:
     - ADR
     - LoD
     - High Volume, Holding 20EMA, Strong Sector (checkboxes)
   - **Close Trade**:
     - Size
     - Stop Loss or Take Profit
     - Additional conditions (e.g., Breaking 20EMA, Critical Price Level)
5. Click the **Done** button to generate the summary.
6. The summary will be copied to your clipboard automatically.


## Notes

- The script runs automatically on TradingView chart pages (`https://www.tradingview.com/chart/*`).
- The popup will close automatically after the summary is copied to the clipboard.