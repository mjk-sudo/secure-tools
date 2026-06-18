# SecureTools — Offline Cryptographic & Steganography Suite

A premium, fully client-side cybersecurity toolkit designed for secure, offline operations. Process asymmetric key generation, symmetric encryption, least-significant-bit steganography, hashing, and password strength analysis locally in the browser with zero server dependencies or data transmission.

Built with a minimalist, high-end engineering design system featuring fluid motion design, particle network visualizers, bento-grid layout architecture, and hardware-accelerated processing via the Web Crypto API.

## Core Capabilities

- **RSA Asymmetric Suite**: Hardware-accelerated 2048/4096-bit key pair generation, PEM export, public-key encryption, and private-key decryption utilizing the native browser **Web Crypto API**.
- **Image Steganography**: LosslessLeast-Significant-Bit (LSB) pixel modification tool to conceal text messages inside PNG images invisibly.
- **Symmetric Ciphers**: Client-side AES-256 (via CryptoJS), Caesar Shift, and Vigenère polyalphabetic ciphers.
- **Cryptographic Hashing**: File checksum integrity verification (via drag-and-drop) and text digests supporting MD5, SHA-1, SHA-256, and SHA-512.
- **Password Strength Analyser**: Mathematical entropy calculation (bits), offline brute-force GPU crack-time estimation, and interactive requirements checklist.
- **Web Encoder & Converter**: Multi-format converter (Plaintext, Binary, Hexadecimal, Base64, Decimal ASCII, Octal) and web encoder (URL encode, HTML escape).

## Technical Implementation

- **Zero-Dependency Core**: 100% client-side execution. No servers, no tracking, and no external API requests.
- **UI System**: Autoritative dark-mode design system utilizing CSS Custom Variables, responsive Flexbox/Grid layouts, and Inter/JetBrains Mono typography.
- **Motion System**: Smooth scroll physics powered by **Lenis**, scroll-triggered viewport animations (`IntersectionObserver`), magnetic cursor interactions, and page-load transitions.
- **Audio Synthesis**: Interactive, low-latency audio feedback generated programmatically via the native Web Audio API.

## Getting Started

To run the application locally:
1. Clone the repository: `git clone https://github.com/your-username/secure-tools.git`
2. Open `index.html` in any modern web browser or serve it using a local static file server.
