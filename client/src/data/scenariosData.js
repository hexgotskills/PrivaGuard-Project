export const SCENARIOS = [
  {
    id: 1,
    type: 'email',
    typeLabel: '📧 Phishing Email',
    difficulty: 'Easy',
    title: 'The Bank Alert',
    intro: 'You receive this email on a Monday morning. Something feels off...',
    email: {
      from: { display: 'National Bank Security', address: 'security@nationalbxnk-secure.com' },
      subject: '⚠️ URGENT: Suspicious Login Detected on Your Account',
      body: `Dear Valued Customer,

We have detected a suspicious login attempt on your National Bank account from an unknown device in another country.

Your account will be permanently SUSPENDED within 24 hours unless you verify your identity immediately using the link below.

→ Verify My Account Now

Failure to verify may result in permanent suspension and referral to our fraud investigation team.

National Bank Security Team
Do not reply to this email.`
    },
    flags: [
      {
        id: 'domain',
        trigger: 'nationalbxnk-secure.com',
        label: 'Spoofed domain',
        color: 'red',
        explanation: 'The email is from "nationalbxnk-secure.com" — notice the "x" instead of "k" in "bank". Attackers register look-alike domains hoping you won\'t notice at a glance.'
      },
      {
        id: 'greeting',
        trigger: 'Dear Valued Customer',
        label: 'Generic greeting',
        color: 'amber',
        explanation: 'Your real bank addresses you by your full name. "Dear Valued Customer" means the sender doesn\'t actually know who you are — it\'s a mass phishing campaign.'
      },
      {
        id: 'urgency',
        trigger: '24 hours',
        label: 'Artificial urgency',
        color: 'red',
        explanation: 'A 24-hour deadline is a pressure tactic designed to stop you from thinking. Real banks never suspend accounts on email ultimatums — they call or send letters.'
      }
    ]
  },

  {
    id: 2,
    type: 'sms',
    typeLabel: '📱 Fake SMS',
    difficulty: 'Easy',
    title: 'The Prize Winner',
    intro: 'You get this SMS out of the blue from an unknown number...',
    sms: {
      from: '+1-888-WIN-2026',
      messages: [
        { side: 'received', text: '🎉 Congrats! You\'ve been randomly selected as our lucky winner this month!' },
        { side: 'received', text: 'Claim your FREE iPhone 16 Pro Max before it expires in 2 hours 👉 bit.ly/clm-prze-now99' },
        { side: 'received', text: 'Reply STOP to opt out.' }
      ]
    },
    flags: [
      {
        id: 'unknown',
        trigger: '+1-888-WIN-2026',
        label: 'Unknown sender',
        color: 'amber',
        explanation: 'You never entered any contest with this number. Legitimate prize organisations communicate through verified channels you\'ve previously interacted with.'
      },
      {
        id: 'toogood',
        trigger: 'FREE iPhone 16 Pro Max',
        label: 'Too good to be true',
        color: 'red',
        explanation: 'Nobody randomly wins a free flagship phone. If it feels unbelievably good, it is. This is a lure designed to make you act before your rational brain kicks in.'
      },
      {
        id: 'link',
        trigger: 'bit.ly/clm-prze-now99',
        label: 'Suspicious shortened link',
        color: 'red',
        explanation: 'Shortened URLs hide the real destination. "clm-prze-now99" has no connection to any real company. Never click shortened links from unknown SMS senders.'
      }
    ]
  },

  {
    id: 3,
    type: 'email',
    typeLabel: '📧 Phishing Email',
    difficulty: 'Medium',
    title: 'IT Help Desk',
    intro: 'You get this email while in the middle of work. Looks semi-official...',
    email: {
      from: { display: 'IT Support Desk', address: 'helpdesk@company-support-desk.net' },
      subject: '[ACTION REQUIRED] Your Password Expires in 2 Hours',
      body: `Hi,

This is an automated alert from your company IT department.

Your account password is set to expire in 2 hours. To avoid losing access to all company systems, please reset it immediately using the link below.

You will be required to enter your CURRENT password to confirm your identity before setting a new one.

→ Reset Password Now: secure.company-support-desk.net/reset

If you do not complete this within 2 hours, your account will be locked and you will need to contact IT to regain access.

IT Support Team`
    },
    flags: [
      {
        id: 'domain',
        trigger: 'company-support-desk.net',
        label: 'External domain impersonating IT',
        color: 'red',
        explanation: 'Your real IT department would email you from your company\'s own domain. "company-support-desk.net" is a generic external domain — a classic sign of impersonation.'
      },
      {
        id: 'currentpass',
        trigger: 'CURRENT password to confirm your identity',
        label: 'Asking for your current password',
        color: 'red',
        explanation: 'Legitimate password reset flows never ask for your current password. This is the attacker\'s goal — harvest your existing credentials to log into your real account.'
      },
      {
        id: 'urgency',
        trigger: '2 hours',
        label: 'Extreme time pressure',
        color: 'amber',
        explanation: 'Two hours is far tighter than any real IT system would give. This urgency is designed to make you skip verification steps and just click.'
      }
    ]
  },

  {
    id: 4,
    type: 'call',
    typeLabel: '📞 Vishing Call',
    difficulty: 'Medium',
    title: 'Microsoft Support',
    intro: 'Your phone rings. The caller claims to be from Microsoft tech support...',
    call: {
      callerName: 'David — Microsoft Technical Support',
      callerNumber: '+1 (800) 555-0198',
      transcript: [
        { speaker: 'Caller', text: '"Hello, this is David calling from Microsoft Technical Support."' },
        { speaker: 'Caller', text: '"We have detected that your Windows computer is sending critical error reports to our servers. This indicates a severe virus infection."' },
        { speaker: 'Caller', text: '"If this is not fixed immediately, your personal files and banking information could be permanently compromised."' },
        { speaker: 'Caller', text: '"Please sit at your computer right now and I will walk you through downloading our remote access tool so we can fix this for you today, at absolutely no cost."' },
        { speaker: 'You', text: '"How do I know you\'re really from Microsoft?"' },
        { speaker: 'Caller', text: '"Sir/Ma\'am, I am calling from Microsoft\'s official support line. We have your computer\'s unique ID in our system. This is extremely urgent."' }
      ]
    },
    flags: [
      {
        id: 'unsolicited',
        trigger: '"Hello, this is David calling from Microsoft"',
        label: 'Microsoft never cold-calls you',
        color: 'red',
        explanation: 'Microsoft, Apple, and Google never call you unsolicited to report problems on your device. They have no way to monitor your computer unless you\'ve already given permission. Hang up.'
      },
      {
        id: 'fear',
        trigger: '"banking information could be permanently compromised"',
        label: 'Fear and urgency tactic',
        color: 'amber',
        explanation: 'Threatening your bank account and "permanent" damage is a fear tactic to bypass your critical thinking. Scammers escalate the threat when you hesitate.'
      },
      {
        id: 'remoteaccess',
        trigger: '"downloading our remote access tool"',
        label: 'Requesting remote access',
        color: 'red',
        explanation: 'This is the end goal. Remote access tools hand complete control of your device to the attacker. Once installed, they can steal files, install malware, or lock you out.'
      }
    ]
  },

  {
    id: 5,
    type: 'email',
    typeLabel: '📧 CEO Fraud',
    difficulty: 'Hard',
    title: 'The CEO Request',
    intro: 'You get this email from what appears to be your CEO\'s address. The stakes feel real...',
    email: {
      from: { display: 'Rahul Mehta (CEO)', address: 'r.mehta@companv-corp.com' },
      subject: 'Urgent — Confidential Vendor Payment',
      body: `Hi,

I'm in a critical investor meeting right now and completely unavailable to call. I need your immediate help on a time-sensitive matter.

We're closing a confidential vendor deal today and I need you to process a wire transfer of ₹7,40,000 to this account:

Account Name: Premier Solutions Group
Account No: 9823041234  
IFSC: HDFC0001234

This must be processed before 4pm today. The deal is under NDA so please do not discuss this with anyone else in the office — not even your manager — until the transfer is confirmed.

I'll explain everything after the meeting. You'll be compensated for handling this.

Thanks,
Rahul Mehta
CEO
Sent from iPhone`
    },
    flags: [
      {
        id: 'domain',
        trigger: 'companv-corp.com',
        label: 'Typosquatted CEO domain',
        color: 'red',
        explanation: '"companv-corp.com" uses a "v" instead of "y" — almost invisible at a quick glance. Always check the full email address, not just the display name at the top.'
      },
      {
        id: 'secrecy',
        trigger: 'do not discuss this with anyone else in the office',
        label: 'Demands total secrecy',
        color: 'red',
        explanation: 'Legitimate financial requests always go through verification channels. Any request that asks you to bypass your manager or keep it secret is a massive red flag — it\'s designed to prevent you from getting a second opinion.'
      },
      {
        id: 'pressure',
        trigger: 'before 4pm tody',
        label: 'Same-day deadline pressure',
        color: 'amber',
        explanation: 'A real CEO processing a large vendor payment would use proper procurement channels — not a personal email with a same-day deadline. The urgency is designed to prevent you from calling the CEO directly to verify.'
      }
    ]
  }
];

export const RANKS = [
  { min: 0,   max: 80,  title: 'Rookie',          emoji: '🔰', message: 'Keep training — attackers are counting on you not knowing this.' },
  { min: 81,  max: 160, title: 'Analyst',          emoji: '🔍', message: 'Decent instincts. A few more sessions and you\'ll be sharp.' },
  { min: 161, max: 240, title: 'Cyber Defender',   emoji: '🛡️', message: 'Strong awareness. Most people would fall for what you caught.' },
  { min: 241, max: 360, title: 'Elite Shield',     emoji: '⚡', message: 'Impressive. You\'re harder to fool than 95% of internet users.' },
  { min: 361, max: 450, title: 'Perfect Score',    emoji: '🏆', message: 'Flawless. You spotted everything. You ARE the red team.' }
];
