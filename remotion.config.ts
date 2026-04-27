import { Config } from '@remotion/cli/config';
import { existsSync } from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setEntryPoint('remotion/index.ts');
Config.setPublicDir('public');
Config.setConcurrency(1);

// Reuse the system chrome-headless-shell that Playwright already provisioned.
// New Chrome dropped legacy headless mode; the headless_shell binary preserves it.
const HEADLESS_SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(HEADLESS_SHELL)) {
  Config.setBrowserExecutable(HEADLESS_SHELL);
}
