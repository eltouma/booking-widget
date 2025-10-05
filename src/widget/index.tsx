import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import widgetCSS from './styles/styles.css';

function initializeWidget(options?: { target?: string; clientKey?: string }) {
  const targetSelector = options?.target || '#widget';
  const hostContainer = document.querySelector(targetSelector);

  if (!hostContainer) {
    console.warn(`[BookingWidget] target ${targetSelector} not found`);
    return ;
  }

  const container = document.createElement('div');
  hostContainer.appendChild(container);
  const shadow = container.attachShadow({ mode: 'open'});
  const shadowRoot = document.createElement('div');
  shadowRoot.id = 'widget-root';
  shadow.appendChild(shadowRoot);

  const styleTag = document.createElement('style');
  styleTag.textContent = widgetCSS;
  shadow.appendChild(styleTag);

  const root = createRoot(shadowRoot);
  root.render(<WidgetContainer clientKey={options?.clientKey || ''} />);
}

(window as any).BookingWidget = { init: initializeWidget };

