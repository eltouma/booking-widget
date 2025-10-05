//import React from 'react';
import { createRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/styles.css';

// Fonction principale pour initialiser le widget
function initializeWidget(options?: { target?: string; clientKey?: string }) {
  // Le container cible (div fourni par le site hôte)
  const targetSelector = options?.target || '#widget';
  const hostContainer = document.querySelector(targetSelector);

  if (!hostContainer) {
    console.warn(`[BookingWidget] Target ${targetSelector} not found`);
    return;
  }

  // Crée un div parent pour le Shadow DOM
  const container = document.createElement('div');
  hostContainer.appendChild(container);

  // Création du Shadow DOM
  const shadow = container.attachShadow({ mode: 'open' });
  const shadowRoot = document.createElement('div');
  shadowRoot.id = 'widget-root';
  shadow.appendChild(shadowRoot);

  // Injection du CSS dans le Shadow DOM
  const styleTag = document.createElement('style');
  styleTag.textContent = getWidgetCSS();
  shadow.appendChild(styleTag);

  // Création du root React
  const root = createRoot(shadowRoot);
  root.render(<WidgetContainer clientKey={options?.clientKey || ''} />);
}

// Fonction pour récupérer le CSS du widget compilé par Rollup
// Ici, on suppose que Rollup a généré une variable globale __BOOKING_WIDGET_CSS__
// Si tu veux un fichier CSS séparé, tu peux remplacer cette fonction par un <link>
function getWidgetCSS(): string {
  return (window as any).__BOOKING_WIDGET_CSS__ || '';
}

// Expose le widget globalement
(window as any).BookingWidget = {
  init: initializeWidget,
};

{/*
import { hydrateRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
import './styles/styles.css';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    const element = document.createElement('div');
    const shadow = element.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    const clientKey = getClientKey();

    shadowRoot.id = 'widget-root';

    const component = (
      <WidgetContainer clientKey={clientKey} />
    );

    shadow.appendChild(shadowRoot);
    injectStyle(shadowRoot);
    hydrateRoot(shadowRoot, component);

    document.body.appendChild(element);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: HTMLElement) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'booking_widget.css';
  shadowRoot.appendChild(link);
}

function getClientKey() {
  const script = document.currentScript as HTMLScriptElement;
  const clientKey = script?.getAttribute('data-client-key');

  if (!clientKey) {
    throw new Error('Missing data-client-key attribute');
  }

  return clientKey;
}

initializeWidget();
*/}
