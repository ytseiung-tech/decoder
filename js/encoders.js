/**
 * Encoder functions for the decoder application
 */

const encoders = {
    /**
     * Encode text to Base64
     * @param {string} text - Text to encode
     * @returns {string} - Base64 encoded text
     */
    base64: function(text) {
        try {
            return Base64.encode(text);
        } catch (error) {
            console.error('Base64 encoding error:', error);
            throw new Error('Failed to encode as Base64');
        }
    },
    
    /**
     * Encode text to Base32
     * @param {string} text - Text to encode
     * @returns {string} - Base32 encoded text
     */
    base32: function(text) {
        try {
            // Simple Base32 implementation as there's no built-in library
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let result = '';
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < text.length; i++) {
                value = (value << 8) | text.charCodeAt(i);
                bits += 8;
                
                while (bits >= 5) {
                    bits -= 5;
                    result += alphabet[(value >>> bits) & 31];
                }
            }
            
            // Handle the last bits
            if (bits > 0) {
                result += alphabet[(value << (5 - bits)) & 31];
            }
            
            // Add padding
            while (result.length % 8 !== 0) {
                result += '=';
            }
            
            return result;
        } catch (error) {
            console.error('Base32 encoding error:', error);
            throw new Error('Failed to encode as Base32');
        }
    },
    
    /**
     * Encode text to Base58
     * @param {string} text - Text to encode
     * @returns {string} - Base58 encoded text
     */
    base58: function(text) {
        try {
            const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            const BASE = ALPHABET.length;
            
            let result = '';
            let bytes = Array.from(text).map(c => c.charCodeAt(0));
            
            // Count leading zeros
            let zeros = 0;
            while (bytes[zeros] === 0) {
                zeros++;
            }
            
            // Convert to big integer
            let num = 0n;
            for (let i = 0; i < bytes.length; i++) {
                num = num * 256n + BigInt(bytes[i]);
            }
            
            // Convert to Base58
            while (num > 0n) {
                const remainder = Number(num % BigInt(BASE));
                result = ALPHABET.charAt(remainder) + result;
                num = num / BigInt(BASE);
            }
            
            // Add leading '1's for each leading zero byte
            for (let i = 0; i < zeros; i++) {
                result = '1' + result;
            }
            
            return result;
        } catch (error) {
            console.error('Base58 encoding error:', error);
            throw new Error('Failed to encode as Base58');
        }
    },
    
    /**
     * Encode text to Base85 (ASCII85)
     * @param {string} text - Text to encode
     * @returns {string} - Base85 encoded text
     */
    base85: function(text) {
        try {
            // Basic ASCII85 encoding
            const ALPHABET = String.fromCharCode(...Array(85).keys()).slice(33) + 'z';
            let result = '<~';
            
            // Process 4 bytes at a time
            for (let i = 0; i < text.length; i += 4) {
                let chunk = text.slice(i, i + 4);
                
                // Pad with nulls if necessary
                while (chunk.length < 4) {
                    chunk += '\0';
                }
                
                // Convert to 32-bit integer
                let value = 0;
                for (let j = 0; j < 4; j++) {
                    value = (value << 8) | chunk.charCodeAt(j);
                }
                
                // Special case for all nulls
                if (value === 0 && chunk.length === 4) {
                    result += 'z';
                    continue;
                }
                
                // Convert to 5 base-85 digits
                let base85Chars = '';
                for (let j = 0; j < 5; j++) {
                    const digit = value % 85;
                    base85Chars = ALPHABET[digit] + base85Chars;
                    value = Math.floor(value / 85);
                }
                
                // Add to result, truncating if we had padding
                result += base85Chars.slice(0, chunk.length + 1);
            }
            
            result += '~>';
            return result;
        } catch (error) {
            console.error('Base85 encoding error:', error);
            throw new Error('Failed to encode as Base85');
        }
    },
    
    /**
     * Encode text to URL encoding
     * @param {string} text - Text to encode
     * @returns {string} - URL encoded text
     */
    url: function(text) {
        try {
            return encodeURIComponent(text);
        } catch (error) {
            console.error('URL encoding error:', error);
            throw new Error('Failed to URL encode');
        }
    },
    
    /**
     * Encode text to HTML entities
     * @param {string} text - Text to encode
     * @returns {string} - HTML entity encoded text
     */
    html: function(text) {
        try {
            const entities = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            
            return text.replace(/[&<>"'`=\/]/g, char => entities[char]);
        } catch (error) {
            console.error('HTML entity encoding error:', error);
            throw new Error('Failed to encode HTML entities');
        }
    },
    
    /**
     * Encode text to Unicode escape sequences
     * @param {string} text - Text to encode
     * @returns {string} - Unicode escaped text
     */
    unicode: function(text) {
        try {
            return Array.from(text)
                .map(char => {
                    const code = char.charCodeAt(0);
                    return '\\u' + code.toString(16).padStart(4, '0');
                })
                .join('');
        } catch (error) {
            console.error('Unicode escape encoding error:', error);
            throw new Error('Failed to encode Unicode escapes');
        }
    },
    
    /**
     * Encode text to hexadecimal
     * @param {string} text - Text to encode
     * @returns {string} - Hex encoded text
     */
    hex: function(text) {
        try {
            return Array.from(text)
                .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(' ');
        } catch (error) {
            console.error('Hex encoding error:', error);
            throw new Error('Failed to encode as hexadecimal');
        }
    },
    
    /**
     * Encode text to binary
     * @param {string} text - Text to encode
     * @returns {string} - Binary encoded text
     */
    binary: function(text) {
        try {
            return Array.from(text)
                .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
                .join(' ');
        } catch (error) {
            console.error('Binary encoding error:', error);
            throw new Error('Failed to encode as binary');
        }
    },
    
    /**
     * Encode text to octal
     * @param {string} text - Text to encode
     * @returns {string} - Octal encoded text
     */
    octal: function(text) {
        try {
            return Array.from(text)
                .map(char => char.charCodeAt(0).toString(8).padStart(3, '0'))
                .join(' ');
        } catch (error) {
            console.error('Octal encoding error:', error);
            throw new Error('Failed to encode as octal');
        }
    },
    
    /**
     * Encode text using ROT13
     * @param {string} text - Text to encode
     * @returns {string} - ROT13 encoded text
     */
    rot13: function(text) {
        try {
            return text.replace(/[a-zA-Z]/g, char => {
                const code = char.charCodeAt(0);
                // For uppercase letters
                if (code >= 65 && code <= 90) {
                    return String.fromCharCode(((code - 65 + 13) % 26) + 65);
                }
                // For lowercase letters
                else if (code >= 97 && code <= 122) {
                    return String.fromCharCode(((code - 97 + 13) % 26) + 97);
                }
                return char;
            });
        } catch (error) {
            console.error('ROT13 encoding error:', error);
            throw new Error('Failed to encode with ROT13');
        }
    },
    
    /**
     * Encode text using ROT-N
     * @param {string} text - Text to encode
     * @param {number} shift - Shift value
     * @returns {string} - ROT-N encoded text
     */
    'rot-n': function(text, shift = 13) {
        try {
            shift = parseInt(shift, 10);
            if (isNaN(shift)) shift = 13;
            
            shift = ((shift % 26) + 26) % 26; // Normalize shift to be between 0-25
            
            return text.replace(/[a-zA-Z]/g, char => {
                const code = char.charCodeAt(0);
                // For uppercase letters
                if (code >= 65 && code <= 90) {
                    return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                }
                // For lowercase letters
                else if (code >= 97 && code <= 122) {
                    return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                return char;
            });
        } catch (error) {
            console.error('ROT-N encoding error:', error);
            throw new Error('Failed to encode with ROT-N');
        }
    },
    
    /**
     * Encode text using Caesar cipher
     * @param {string} text - Text to encode
     * @param {number} shift - Shift value
     * @returns {string} - Caesar cipher encoded text
     */
    caesar: function(text, shift = 3) {
        try {
            // Caesar cipher is the same as ROT-N with a default shift of 3
            return this['rot-n'](text, shift);
        } catch (error) {
            console.error('Caesar cipher encoding error:', error);
            throw new Error('Failed to encode with Caesar cipher');
        }
    },
    
    /**
     * Encode text using Vigenère cipher
     * @param {string} text - Text to encode
     * @param {string} key - Cipher key
     * @returns {string} - Vigenère cipher encoded text
     */
    vigenere: function(text, key = '') {
        try {
            if (!key) throw new Error('Vigenère cipher requires a key');
            
            // Filter key to only include letters
            key = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
            if (key.length === 0) throw new Error('Vigenère cipher key must contain letters');
            
            let result = '';
            let keyIndex = 0;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const code = char.charCodeAt(0);
                
                // Only encode letters
                if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                    const isUpperCase = code >= 65 && code <= 90;
                    const baseCode = isUpperCase ? 65 : 97;
                    const keyChar = key[keyIndex % key.length];
                    const keyShift = keyChar.charCodeAt(0) - 65; // A=0, B=1, etc.
                    
                    // Apply Vigenère shift
                    const shifted = (code - baseCode + keyShift) % 26 + baseCode;
                    result += String.fromCharCode(shifted);
                    
                    keyIndex++;
                } else {
                    result += char;
                }
            }
            
            return result;
        } catch (error) {
            console.error('Vigenère cipher encoding error:', error);
            throw new Error('Failed to encode with Vigenère cipher: ' + error.message);
        }
    },
    
    /**
     * Encode text to Morse code
     * @param {string} text - Text to encode
     * @returns {string} - Morse code
     */
    morse: function(text) {
        try {
            const morseCodeMap = {
                'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
                'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
                'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
                'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
                'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
                'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
                '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
                '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
                "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
                ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
                '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
                '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
            };
            
            return text.toUpperCase().split('')
                .map(char => {
                    if (char === ' ') return '   '; // 3 spaces for word separation
                    return morseCodeMap[char] || char;
                })
                .join(' ');
        } catch (error) {
            console.error('Morse code encoding error:', error);
            throw new Error('Failed to encode as Morse code');
        }
    }
};

// Export encoders for use in other modules
window.encoders = encoders;
