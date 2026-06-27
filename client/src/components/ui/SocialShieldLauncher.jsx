import { useState } from 'react';
import SocialShield from '../tools/SocialShield';

export default function SocialShieldLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="ss-launcher-tab"
        onClick={() => setOpen(true)}
        aria-label="Open SocialShield trainer"
        title="SocialShield — Social engineering trainer"
      >
        <span className="ss-launcher-pulse" />
        SocialShield
        🛡
      </button>
      {open && <SocialShield onClose={() => setOpen(false)} />}
    </>
  );
}
