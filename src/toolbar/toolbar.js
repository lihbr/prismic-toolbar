import { render } from 'preact';
import { appendCSS, shadow, readyDOM } from 'common';
import { Toolbar as ToolbarComponent } from './components';
import shadowStyles from './index.css';

export class Toolbar {
  constructor({ messenger, preview, prediction, analytics }) {
    this.messenger = messenger;
    this.preview = preview;
    this.prediction = prediction;
    this.analytics = analytics;
    this.setup();
  }

  async setup() {
    const { auth } = await this.messenger.post('state');

    // Hide for normal visitors
    if (!auth && !this.preview.active) return;

    // Because we need the DOM now
    await readyDOM();

    // Create toolbar in a shadow DOM
    const toolbar = shadow({
      id: 'prismic-toolbar-v2',
      style: { position: 'fixed', zIndex: 2147483647 },
    });

    // Put above Intercom
    appendCSS(document.body, `#intercom-container { z-index: 2147483646 !important }`);

    // Styles
    appendCSS(toolbar, shadowStyles);

    // Render the React app
    render(
      <ToolbarComponent
        preview={this.preview}
        prediction={this.prediction}
        analytics={this.analytics}
      />,
      toolbar
    );
  }
}