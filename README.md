# Full Page Screenshot Extension

This is a Chrome extension that allows users to capture full-page screenshots or visible screen screenshots of any webpage. The extension uses `html2canvas` to capture the full page and the Chrome `downloads` API to save the screenshots.

## Features

- Capture full-page screenshots
- Capture visible screen screenshots
- Save screenshots automatically with a timestamped filename

## Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:mones-cse/full-page-screenshot-extension-.git
   cd full-page-screenshot-extension
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the extension:
   ```sh
   npm run build
   ```

## Usage

1. Open Chrome and go to chrome://extensions/.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click on "Load unpacked" and select the dist directory from the project.

## Development

To watch for changes and rebuild automatically:

```
npm run watch
```

## Scripts

- `npm run build`: Build the project for production.
- `npm run watch`: Watch for changes and rebuild automatically.
- `npm run clean`: Clean the dist directory.

## License

This project is licensed under the MIT License.
