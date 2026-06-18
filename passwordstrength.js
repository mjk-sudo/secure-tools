// Wait for the HTML page to load completely
document.addEventListener('DOMContentLoaded', function() {
    const pwdInput = document.getElementById('pwdInput');
    if (pwdInput) {
        pwdInput.addEventListener('input', checkPasswordStrength);
    }
});

// Function to switch tabs
function switchTab(tabName) {
    const pwdStrength = document.getElementById("pwd-strength");
    const pwdGen = document.getElementById("pwd-gen");
    const tabStrength = document.getElementById("tab-strength");
    const tabGen = document.getElementById("tab-generate");

    if (tabName === 'strength') {
        pwdStrength.style.display = 'block';
        pwdGen.style.display = 'none';
        tabStrength.classList.add('active');
        tabGen.classList.remove('active');
    } else {
        pwdGen.style.display = 'block';
        pwdStrength.style.display = 'none';
        tabGen.classList.add('active');
        tabStrength.classList.remove('active');
    }
}

// Function to show/hide password text
function togglePassword() {
    const input = document.getElementById("pwdInput");
    const toggle = document.getElementById("togglePasswordBtn");
    if (!input || !toggle) return;

    if (input.type === "password") {
        input.type = "text";
        toggle.textContent = "Hide";
    } else {
        input.type = "password";
        toggle.textContent = "Show";
    }
}

// Update length slider label
function updateLengthLabel(val) {
    const label = document.getElementById('length-val');
    if (label) label.textContent = val;
}

// Function to check password strength and calculate entropy
function checkPasswordStrength() {
    const passwordInput = document.getElementById('pwdInput');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const entropyValue = document.getElementById('entropy-value');
    const crackTime = document.getElementById('crack-time');
    const detailsDiv = document.getElementById('entropy-details');

    if (!passwordInput || !strengthBar || !strengthText) return;

    const password = passwordInput.value;

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Enter a password to begin analysis.';
        strengthText.className = 'strength-text';
        if (detailsDiv) detailsDiv.style.display = 'none';
        
        // Reset checklist
        const reqs = ['length', 'uppercase', 'lowercase', 'number', 'special'];
        reqs.forEach(r => document.getElementById(`req-${r}`).classList.remove('met'));
        return;
    }

    if (detailsDiv) detailsDiv.style.display = 'block';

    // 1. Check Requirements checklist
    const lengthMet = password.length >= 8;
    const upperMet = /[A-Z]/.test(password);
    const lowerMet = /[a-z]/.test(password);
    const numMet = /[0-9]/.test(password);
    const specialMet = /[^A-Za-z0-9]/.test(password);

    document.getElementById('req-length').classList.toggle('met', lengthMet);
    document.getElementById('req-uppercase').classList.toggle('met', upperMet);
    document.getElementById('req-lowercase').classList.toggle('met', lowerMet);
    document.getElementById('req-number').classList.toggle('met', numMet);
    document.getElementById('req-special').classList.toggle('met', specialMet);

    // 2. Calculate Entropy (E = L * log2(R))
    let poolSize = 0;
    if (upperMet) poolSize += 26;
    if (lowerMet) poolSize += 26;
    if (numMet) poolSize += 10;
    if (specialMet) poolSize += 32; // Special characters standard pool
    if (poolSize === 0) poolSize = 1;

    const entropy = Math.round(password.length * Math.log2(poolSize));
    if (entropyValue) entropyValue.textContent = entropy;

    // 3. Determine crack time
    // Let's assume a brute-force rate of 10 billion (1e10) guesses/sec (high-speed GPU clusters)
    const guesses = Math.pow(2, entropy);
    const secondsToCrack = guesses / 1e10;
    let crackTimeStr = '';

    if (secondsToCrack < 1) {
        crackTimeStr = 'Instant (under 1 second)';
    } else if (secondsToCrack < 60) {
        crackTimeStr = `${Math.round(secondsToCrack)} seconds`;
    } else if (secondsToCrack < 3600) {
        crackTimeStr = `${Math.round(secondsToCrack / 60)} minutes`;
    } else if (secondsToCrack < 86400) {
        crackTimeStr = `${Math.round(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack < 31536000) {
        crackTimeStr = `${Math.round(secondsToCrack / 86400)} days`;
    } else if (secondsToCrack < 31536000000) {
        crackTimeStr = `${Math.round(secondsToCrack / 31536000)} years`;
    } else if (secondsToCrack < 31536000000000) {
        crackTimeStr = `${Math.round(secondsToCrack / 31536000000)} thousand years`;
    } else if (secondsToCrack < 31536000000000000) {
        crackTimeStr = `${Math.round(secondsToCrack / 31536000000000)} million years`;
    } else {
        crackTimeStr = 'Trillions of years';
    }

    if (crackTime) crackTime.textContent = crackTimeStr;

    // 4. Update UI Strength Indicator
    let strengthClass = '';
    let strengthLabel = '';
    let widthPercent = 0;

    if (entropy < 28) {
        strengthClass = 'weak';
        strengthLabel = 'Very Weak';
        widthPercent = 25;
    } else if (entropy < 50) {
        strengthClass = 'fair';
        strengthLabel = 'Weak';
        widthPercent = 50;
    } else if (entropy < 75) {
        strengthClass = 'good';
        strengthLabel = 'Good';
        widthPercent = 75;
    } else {
        strengthClass = 'strong';
        strengthLabel = 'Strong';
        widthPercent = 100;
    }

    strengthBar.style.width = widthPercent + '%';
    strengthBar.className = 'strength-bar bar-' + strengthClass;
    strengthText.textContent = strengthLabel;
    strengthText.className = 'strength-text strength-' + strengthClass;

    // Debounce or rate-limit logging so we don't log on every keystroke,
    // or just log once when they blur, or periodically.
    // For simplicity, we can log to localStorage but only details about length/entropy
    // NOT the actual password!
    if (password.length > 0 && !passwordInput.dataset.logged) {
        // Let's delay the log or do it once
        passwordInput.dataset.logged = 'true';
        // Clear flag when empty
        setTimeout(() => {
            if (typeof logAction === 'function') {
                logAction('Password Checked', `L: ${password.length} chars | Entropy: ${entropy} bits`);
            }
        }, 1000);
    }
    
    // Clear logged flag if password becomes empty
    if (password.length === 0) {
        delete passwordInput.dataset.logged;
    }
}

// Function to generate a secure random password
function generateSecurePassword() {
    const length = parseInt(document.getElementById('gen-length').value) || 16;
    const upper = document.getElementById('gen-upper').checked;
    const lower = document.getElementById('gen-lower').checked;
    const number = document.getElementById('gen-number').checked;
    const special = document.getElementById('gen-special').checked;

    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_+=<>?';

    let pool = '';
    let password = '';
    let typesUsed = [];

    // Ensure at least one character from each selected pool is used
    if (upper) {
        pool += upperChars;
        password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
        typesUsed.push('U');
    }
    if (lower) {
        pool += lowerChars;
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
        typesUsed.push('L');
    }
    if (number) {
        pool += numberChars;
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        typesUsed.push('N');
    }
    if (special) {
        pool += specialChars;
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        typesUsed.push('S');
    }

    if (pool === '') {
        // Check lower by default if nothing is selected
        document.getElementById('gen-lower').checked = true;
        if (typeof showToast === 'function') showToast('Please select at least one character set.', true);
        return;
    }

    // Fill the remaining length randomly
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        password += pool.charAt(randomIndex);
    }

    // Shuffle the generated password characters to avoid predictable patterns
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    const outputField = document.getElementById("passOut");
    if (outputField) {
        outputField.value = password;
    }

    if (typeof showToast === 'function') showToast('Secure password generated!');
    if (typeof logAction === 'function') {
        logAction('Password Generated', `Length: ${length} chars | Complexity: ${typesUsed.join('')}`);
    }
}

// Reset generator values
function resetGen() {
    const outputField = document.getElementById("passOut");
    if (outputField) outputField.value = '';
    
    document.getElementById('gen-length').value = 16;
    updateLengthLabel(16);
    document.getElementById('gen-upper').checked = true;
    document.getElementById('gen-lower').checked = true;
    document.getElementById('gen-number').checked = true;
    document.getElementById('gen-special').checked = true;
    
    if (typeof showToast === 'function') showToast('Generator settings reset.');
}

// Copy password function
function copyGeneratedPassword() {
    const outputField = document.getElementById("passOut");
    if (!outputField || !outputField.value) {
        if (typeof showToast === 'function') showToast('Generate a password first.', true);
        return;
    }
    
    navigator.clipboard.writeText(outputField.value)
        .then(() => {
            if (typeof showToast === 'function') showToast('Password copied to clipboard!');
        })
        .catch(err => {
            if (typeof showToast === 'function') showToast('Failed to copy password.', true);
            console.error('Copy failed:', err);
        });
}
