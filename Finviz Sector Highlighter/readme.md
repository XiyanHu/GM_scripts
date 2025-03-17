# Finviz Sector Highlighter

## Overview

The **Finviz Sector Highlighter** is a Tampermonkey userscript that allows you to quickly fetch and highlight the sector of a stock ticker on Finviz. It also copies the sector name to your clipboard for easy searching.

## Features

- Adds an input field to Finviz group pages (`https://finviz.com/groups.ashx*`).
- Fetches the sector of a stock ticker from Finviz.
- Highlights the sector name and copies it to the clipboard.
- Displays a message with instructions to search for the sector.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Copy the script from [`finviz_sector_highlighter.user.js`](finviz_sector_highlighter.user.js).
3. Create a new script in Tampermonkey and paste the code.
4. Save the script.

## Usage

1. Open a group page on [Finviz](https://finviz.com/groups.ashx).
2. Enter a stock ticker symbol (e.g., `AAPL`) in the input field added at the top of the page.
3. Press the **Enter** key.
4. The script will:
   - Fetch the sector of the entered ticker.
   - Highlight the sector name in a message below the input field.
   - Copy the sector name to your clipboard.
5. Use `Command + F` (Mac) or `Ctrl + F` (Windows) to search for the sector name on the page.

## Notes

- The script runs automatically on Finviz group pages (`https://finviz.com/groups.ashx*`).
- If the sector information is not found, an alert will notify you.

## License

This script is provided as-is under the MIT License.
