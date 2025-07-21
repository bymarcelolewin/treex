## Arm Based Linux Systems
For ARM systems with architecture mismatch:
  - sudo apt-get install chromium-browser - installs system Chromium for ARM
  - No need for npx puppeteer browsers install chrome - Puppeteer will automatically detect and use the system-installed Chromium

  For non-ARM systems:
  - npx puppeteer browsers install chrome - downloads and installs Puppeteer's bundled Chromium