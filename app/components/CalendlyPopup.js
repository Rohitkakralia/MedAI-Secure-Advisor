// components/CalendlyPopup.js

import { PopupWidget } from 'react-calendly';

export default function CalendlyPopup({ url, email, open, onClose }) {
  if (!open) return null;

  return (
    <PopupWidget
      url={url}
      prefill={{ email }}
      pageSettings={{
        backgroundColor: 'ffffff',
        hideEventTypeDetails: false,
        hideLandingPageDetails: false,
        primaryColor: '00a2ff',
        textColor: '4d5055'
      }}
      styles={{
        minWidth: '320px',
        height: '630px',
      }}
      onClose={onClose}
      rootElement={typeof window !== 'undefined' ? document.body : null}
    />
  );
}
