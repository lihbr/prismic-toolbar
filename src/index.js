import Share from './share';
import Config from './config';
import { readyDOM } from './utils';
import Globals, { startExp, setupToolbar, setupEditButton } from './globals';

(async () => {
  // Invalid prismic.endpoint
  if (!Config.baseURL) return console.warn('Invalid window.prismic.endpoint.\nhttps://github.com/prismicio/prismic-toolbar.');

  // Globals
  window.prismic = Globals;

  // Previews
  await Share.listen();
  startExp();

  await readyDOM();

  // Setup
  setupToolbar();
  setupEditButton();
})();
