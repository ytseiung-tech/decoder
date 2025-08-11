/**
 * Utility functions for the decoder application
 */

// DOM element selectors
const DOM = {
    inputText: document.getElementById('input-text'),
    outputText: document.getElementById('output-text'),
    decodeMethod: document.getElementById('decode-method'),
    encodeBtn: document.getElementById('encode-btn'),
    decodeBtn: document.getElementById('decode-btn'),
    tryAllBtn: document.getElementById('try-all-btn'),
    clearBtn: document.getElementById('clear-btn'),
    copyBtn: document.getElementById('copy-btn'),
    optionControls: document.getElementById('option-controls'),
    methodDescription: document.getElementById('method-description'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    fileUpload: document.getElementById('file-upload'),
    fileInfo: document.getElementById('file-info'),
    fileUploadArea: document.querySelector('.file-upload-area'),
    charCount: document.getElementById('char-count'),
    outputType: document.getElementById('output-type')
};

// Method descriptions
const methodDescriptions = {
    tryAll: `
        <h3>Try All Decoding Methods</h3>
        <p>This feature automatically attempts to decode the input text using all available decoding methods and presents the most promising results.</p>
        <p>The results are ranked by readability score, with the most likely human-readable results shown first.</p>
        <p>This is useful when you have encoded or encrypted text but don't know which method was used to encode it.</p>
        <ul>
            <li>The feature tries all standard encoding methods</li>
            <li>For ROT-N and Caesar ciphers, all possible shift values (1-25) are tried</li>
            <li>Results that don't appear to be readable text are filtered out</li>
            <li>The Vigenère cipher is skipped as it requires a specific key</li>
        </ul>
    `,
    base64: `
        <h3>Base64 Encoding</h3>
        <p>Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used when binary data needs to be stored and transferred over media that are designed to deal with text.</p>
        <p>Base64 encodes every 3 bytes of binary data into 4 ASCII characters, using a set of 64 characters (A-Z, a-z, 0-9, +, /) with = as padding.</p>
    `,
    base32: `
        <h3>Base32 Encoding</h3>
        <p>Base32 is a binary-to-text encoding that uses a 32-character set, typically using uppercase letters A-Z and numbers 2-7. It's designed to be human-readable and avoids similar-looking characters.</p>
        <p>Base32 is commonly used in applications where case-insensitivity is required or where the encoded text needs to be manually typed.</p>
    `,
    base58: `
        <h3>Base58 Encoding</h3>
        <p>Base58 is a binary-to-text encoding scheme used in Bitcoin and other cryptocurrencies. It's similar to Base64 but omits characters that might look similar (0, O, I, l) and non-alphanumeric characters (+, /).</p>
        <p>This encoding makes addresses and identifiers more user-friendly while maintaining enough efficiency in the encoding.</p>
    `,
    base85: `
        <h3>Base85 Encoding</h3>
        <p>Base85, also known as Ascii85, is a binary-to-text encoding scheme that uses 85 printable ASCII characters. It's more efficient than Base64, encoding 4 bytes of binary data into 5 ASCII characters.</p>
        <p>Base85 is often used in PDF files and other applications where space efficiency is important.</p>
    `,
    url: `
        <h3>URL Encoding</h3>
        <p>URL encoding converts characters that are not allowed in a URL into a format that can be transmitted over the Internet. It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.</p>
        <p>For example, space becomes "%20", and non-ASCII characters are encoded according to their UTF-8 character encoding.</p>
    `,
    html: `
        <h3>HTML Entity Encoding</h3>
        <p>HTML entities are special strings that represent characters that might otherwise be interpreted as HTML syntax. They begin with an ampersand (&) and end with a semicolon (;).</p>
        <p>For example, "&lt;" represents the less-than sign (<) and "&amp;" represents the ampersand (&). HTML entities ensure that text is displayed correctly on web pages.</p>
    `,
    unicode: `
        <h3>Unicode Escape</h3>
        <p>Unicode escape sequences represent Unicode characters in formats like \\u0041 (representing "A"). This encoding is commonly used in programming languages to represent characters that might be difficult to input directly.</p>
        <p>Each Unicode escape represents a single Unicode code point, enabling the representation of characters from any writing system.</p>
    `,
    hex: `
        <h3>Hexadecimal Encoding</h3>
        <p>Hexadecimal (base-16) encoding represents each byte of data as two hexadecimal digits (0-9, A-F). It's a compact way to represent binary data in a human-readable format.</p>
        <p>Hex encoding is widely used in computing for representing memory addresses, binary file contents, and color values.</p>
    `,
    binary: `
        <h3>Binary Encoding</h3>
        <p>Binary (base-2) encoding represents data using only two symbols, typically 0 and 1. Each character in text is converted to its binary ASCII or Unicode representation.</p>
        <p>Binary is the fundamental encoding for all digital computers, where data is ultimately stored and processed as sequences of bits.</p>
    `,
    octal: `
        <h3>Octal Encoding</h3>
        <p>Octal (base-8) encoding represents data using the digits 0-7. Each byte can be represented by three octal digits.</p>
        <p>Octal notation is sometimes used in computing for file permissions (like chmod) and other contexts where grouping bits into threes is useful.</p>
    `,
    rot13: `
        <h3>ROT13 Cipher</h3>
        <p>ROT13 (rotate by 13 places) is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet.</p>
        <p>It's a special case of the Caesar cipher, with a shift of 13. ROT13 is its own inverse; applying it twice returns the original text, making it useful for hiding spoilers or puzzle solutions.</p>
    `,
    'rot-n': `
        <h3>ROT-N Cipher</h3>
        <p>ROT-N is a generalized form of the Caesar cipher where each letter is shifted by N positions in the alphabet. For example, ROT-1 shifts each letter one position forward.</p>
        <p>Unlike ROT13, the shift value can be any number, allowing for more variation in the encoding.</p>
    `,
    caesar: `
        <h3>Caesar Cipher</h3>
        <p>The Caesar cipher is one of the simplest and oldest encryption techniques. It works by shifting each letter in the plaintext by a fixed number of positions in the alphabet.</p>
        <p>For example, with a shift of 3, 'A' would become 'D', 'B' would become 'E', and so on. It's named after Julius Caesar, who reportedly used it for private correspondence.</p>
    `,
    vigenere: `
        <h3>Vigenère Cipher</h3>
        <p>The Vigenère cipher is a method of encrypting text using a series of interwoven Caesar ciphers, based on the letters of a keyword.</p>
        <p>It uses a keyword to determine the shift value for each letter in the plaintext, making it more secure than simple substitution ciphers. The keyword is repeated as needed to match the length of the plaintext.</p>
    `,
    morse: `
        <h3>Morse Code</h3>
        <p>Morse code is a method of encoding text characters as sequences of dots and dashes (or short and long signals). It was developed for telegraph communications.</p>
        <p>Each letter, number, and common punctuation mark is represented by a unique sequence. For example, 'A' is represented as '.-' and 'B' as '-...'.</p>
    `
};

// Utility functions
const utils = {
    /**
     * Show an error message
     * @param {string} message - Error message to display
     * @param {HTMLElement} element - Element to append the error message to
     */
    showError: function(message, element) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        
        // Remove any existing error messages
        const existingErrors = element.parentNode.querySelectorAll('.error');
        existingErrors.forEach(el => el.remove());
        
        element.parentNode.appendChild(errorElement);
        
        // Remove the error message after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    },
    
    /**
     * Read a file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} - Promise that resolves to the file contents
     */
    readFileAsText: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            
            reader.readAsText(file);
        });
    },
    
    /**
     * Read a file as an ArrayBuffer
     * @param {File} file - File to read
     * @returns {Promise<ArrayBuffer>} - Promise that resolves to the file contents
     */
    readFileAsArrayBuffer: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            
            reader.readAsArrayBuffer(file);
        });
    },
    
    /**
     * Convert ArrayBuffer to string
     * @param {ArrayBuffer} buffer - ArrayBuffer to convert
     * @returns {string} - Resulting string
     */
    arrayBufferToString: function(buffer) {
        return new TextDecoder().decode(buffer);
    },
    
    /**
     * Convert string to ArrayBuffer
     * @param {string} str - String to convert
     * @returns {ArrayBuffer} - Resulting ArrayBuffer
     */
    stringToArrayBuffer: function(str) {
        return new TextEncoder().encode(str).buffer;
    },

    /**
     * Update the method description based on the selected method
     * @param {string} method - The selected encoding/decoding method
     */
    updateMethodDescription: function(method) {
        DOM.methodDescription.innerHTML = methodDescriptions[method] || '';
    },

    /**
     * Update the option controls based on the selected method
     * @param {string} method - The selected encoding/decoding method
     */
    updateOptionControls: function(method) {
        DOM.optionControls.innerHTML = '';
        
        switch (method) {
            case 'rot-n':
            case 'caesar':
                const shiftGroup = document.createElement('div');
                shiftGroup.className = 'option-group';
                
                const shiftLabel = document.createElement('label');
                shiftLabel.textContent = 'Shift value:';
                
                const shiftInput = document.createElement('input');
                shiftInput.type = 'number';
                shiftInput.className = 'shift-input';
                shiftInput.id = 'shift-value';
                shiftInput.value = method === 'rot-n' ? '13' : '3';
                shiftInput.min = '1';
                shiftInput.max = '25';
                
                shiftGroup.appendChild(shiftLabel);
                shiftGroup.appendChild(shiftInput);
                DOM.optionControls.appendChild(shiftGroup);
                break;
                
            case 'vigenere':
                const keyGroup = document.createElement('div');
                keyGroup.className = 'option-group';
                
                const keyLabel = document.createElement('label');
                keyLabel.textContent = 'Key:';
                
                const keyInput = document.createElement('input');
                keyInput.type = 'text';
                keyInput.className = 'key-input';
                keyInput.id = 'vigenere-key';
                keyInput.placeholder = 'Enter key (letters only)';
                
                keyGroup.appendChild(keyLabel);
                keyGroup.appendChild(keyInput);
                DOM.optionControls.appendChild(keyGroup);
                break;
        }
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Show success message
            const successMessage = document.createElement('span');
            successMessage.className = 'success';
            successMessage.style.marginLeft = '10px';
            successMessage.textContent = 'Copied!';
            
            DOM.copyBtn.parentNode.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            utils.showError('Failed to copy to clipboard', DOM.copyBtn);
        }
    },
    
    /**
     * Check if the text is likely to be readable
     * @param {string} text - Text to check
     * @returns {boolean} - Whether the text appears to be readable
     */
    isReadableText: function(text) {
        // Quick length check
        if (!text || text.length < 3) return false;
        
        // Check for common patterns in readable text
        const alphaRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
        const printableRatio = (text.match(/[\x20-\x7E]/g) || []).length / text.length;
        const controlCharRatio = (text.match(/[\x00-\x1F\x7F]/g) || []).length / text.length;
        
        // Much more lenient check - just make sure:
        // 1. There are some alphabetic characters
        // 2. Most characters are printable
        // 3. Not too many control characters
        return (
            alphaRatio > 0.05 && // Allow much lower alpha ratio
            printableRatio > 0.7 && // Most characters should be printable
            controlCharRatio < 0.2 // Allow more control chars
        );
    },
    
    /**
     * Score the readability of text
     * @param {string} text - Text to score
     * @returns {number} - Readability score (higher is better)
     */
    scoreReadability: function(text) {
        if (!text) return 0;
        
        // Count various character types
        const alpha = (text.match(/[a-zA-Z]/g) || []).length;
        const alphaLower = (text.match(/[a-z]/g) || []).length;
        const alphaUpper = (text.match(/[A-Z]/g) || []).length;
        const digits = (text.match(/[0-9]/g) || []).length;
        const whitespace = (text.match(/\s/g) || []).length;
        const punctuation = (text.match(/[.,;:!?'"()[\]{}]/g) || []).length;
        const words = text.split(/\s+/).length;
        const controlChars = (text.match(/[\x00-\x1F\x7F]/g) || []).length;
        
        // Calculate various ratios
        const alphaRatio = alpha / text.length;
        const lowerToUpperRatio = alphaLower > 0 && alphaUpper > 0 ? alphaLower / (alphaUpper + alphaLower) : 0;
        const wordToCharRatio = words / text.length;
        const punctToWordRatio = words > 0 ? punctuation / words : 0;
        
        // Calculate base score (0-100)
        let score = 0;
        
        // Text with more alphabetic characters is likely more readable
        score += alphaRatio * 40;
        
        // Text with a good mix of uppercase and lowercase is likely more readable
        // Natural language typically has more lowercase than uppercase
        if (lowerToUpperRatio > 0.5 && lowerToUpperRatio < 0.95) {
            score += 20;
        }
        
        // Text with a reasonable word-to-character ratio is likely more readable
        if (wordToCharRatio > 0.1 && wordToCharRatio < 0.3) {
            score += 15;
        }
        
        // Text with a reasonable punctuation-to-word ratio is likely more readable
        if (punctToWordRatio > 0.05 && punctToWordRatio < 0.5) {
            score += 15;
        }
        
        // Penalize text with control characters
        score -= controlChars * 5;
        
        // Penalize text that's too short
        if (text.length < 10) {
            score -= (10 - text.length) * 2;
        }
        
        return Math.max(0, Math.min(100, score));
    }
};

// Export utils for use in other modules
window.utils = utils;
