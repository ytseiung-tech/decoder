/**
 * Decoder functions for the decoder application
 */

const decoders = {
    /**
     * Decode Base64 text
     * @param {string} encoded - Base64 encoded text
     * @returns {string} - Decoded text
     */
    base64: function(encoded) {
        try {
            return Base64.decode(encoded);
        } catch (error) {
            console.error('Base64 decoding error:', error);
            throw new Error('Failed to decode Base64: Invalid input');
        }
    },
    
    /**
     * Decode Base32 text
     * @param {string} encoded - Base32 encoded text
     * @returns {string} - Decoded text
     */
    base32: function(encoded) {
        try {
            encoded = encoded.replace(/=+$/, '');
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let result = '';
            let bits = 0;
            let value = 0;
            
            for (let i = 0; i < encoded.length; i++) {
                const char = encoded[i].toUpperCase();
                const index = alphabet.indexOf(char);
                
                if (index === -1) {
                    throw new Error('Invalid Base32 character: ' + char);
                }
                
                value = (value << 5) | index;
                bits += 5;
                
                if (bits >= 8) {
                    bits -= 8;
                    result += String.fromCharCode((value >>> bits) & 0xff);
                }
            }
            
            return result;
        } catch (error) {
            console.error('Base32 decoding error:', error);
            throw new Error('Failed to decode Base32: ' + error.message);
        }
    },
    
    /**
     * Decode Base58 text
     * @param {string} encoded - Base58 encoded text
     * @returns {string} - Decoded text
     */
    base58: function(encoded) {
        try {
            const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            const BASE = BigInt(ALPHABET.length);
            
            // Count leading '1's
            let zeros = 0;
            while (encoded[zeros] === '1') {
                zeros++;
            }
            
            // Convert from Base58
            let num = 0n;
            for (let i = zeros; i < encoded.length; i++) {
                const char = encoded[i];
                const charIndex = ALPHABET.indexOf(char);
                
                if (charIndex === -1) {
                    throw new Error('Invalid Base58 character: ' + char);
                }
                
                num = num * BASE + BigInt(charIndex);
            }
            
            // Convert to bytes
            let bytes = [];
            while (num > 0n) {
                bytes.unshift(Number(num & 0xffn));
                num = num >> 8n;
            }
            
            // Add leading zeros
            for (let i = 0; i < zeros; i++) {
                bytes.unshift(0);
            }
            
            return bytes.map(byte => String.fromCharCode(byte)).join('');
        } catch (error) {
            console.error('Base58 decoding error:', error);
            throw new Error('Failed to decode Base58: ' + error.message);
        }
    },
    
    /**
     * Decode Base85 (ASCII85) text
     * @param {string} encoded - Base85 encoded text
     * @returns {string} - Decoded text
     */
    base85: function(encoded) {
        try {
            // Check for ASCII85 delimiters and remove them
            if (encoded.startsWith('<~') && encoded.endsWith('~>')) {
                encoded = encoded.substring(2, encoded.length - 2);
            }
            
            let result = '';
            let i = 0;
            
            while (i < encoded.length) {
                if (encoded[i] === 'z') {
                    // Special case: 'z' represents four zeros
                    result += '\0\0\0\0';
                    i++;
                    continue;
                }
                
                if (i + 5 > encoded.length) {
                    throw new Error('Invalid Base85 input: not enough characters');
                }
                
                // Convert 5 Base85 chars to a 32-bit integer
                let value = 0;
                let count = Math.min(5, encoded.length - i);
                
                for (let j = 0; j < count; j++) {
                    const char = encoded[i + j];
                    const code = char.charCodeAt(0) - 33;
                    
                    if (code < 0 || code > 84) {
                        throw new Error('Invalid Base85 character: ' + char);
                    }
                    
                    value = value * 85 + code;
                }
                
                // Convert to 4 bytes
                for (let j = 0; j < count - 1; j++) {
                    const byteVal = (value >>> (8 * (3 - j))) & 0xff;
                    result += String.fromCharCode(byteVal);
                }
                
                i += 5;
            }
            
            return result;
        } catch (error) {
            console.error('Base85 decoding error:', error);
            throw new Error('Failed to decode Base85: ' + error.message);
        }
    },
    
    /**
     * Decode URL encoded text
     * @param {string} encoded - URL encoded text
     * @returns {string} - Decoded text
     */
    url: function(encoded) {
        try {
            return decodeURIComponent(encoded);
        } catch (error) {
            console.error('URL decoding error:', error);
            throw new Error('Failed to URL decode: Invalid input');
        }
    },
    
    /**
     * Decode HTML entity encoded text
     * @param {string} encoded - HTML entity encoded text
     * @returns {string} - Decoded text
     */
    html: function(encoded) {
        try {
            const doc = new DOMParser().parseFromString(encoded, 'text/html');
            return doc.body.textContent || '';
        } catch (error) {
            console.error('HTML entity decoding error:', error);
            throw new Error('Failed to decode HTML entities');
        }
    },
    
    /**
     * Decode Unicode escaped text
     * @param {string} encoded - Unicode escaped text
     * @returns {string} - Decoded text
     */
    unicode: function(encoded) {
        try {
            return encoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });
        } catch (error) {
            console.error('Unicode escape decoding error:', error);
            throw new Error('Failed to decode Unicode escapes');
        }
    },
    
    /**
     * Decode hexadecimal text
     * @param {string} encoded - Hex encoded text
     * @returns {string} - Decoded text
     */
    hex: function(encoded) {
        try {
            // Remove whitespace and split into bytes
            const hexBytes = encoded.trim().replace(/\s+/g, ' ').split(' ');
            
            return hexBytes
                .map(hex => String.fromCharCode(parseInt(hex, 16)))
                .join('');
        } catch (error) {
            console.error('Hex decoding error:', error);
            throw new Error('Failed to decode hexadecimal: Invalid input');
        }
    },
    
    /**
     * Decode binary text
     * @param {string} encoded - Binary encoded text
     * @returns {string} - Decoded text
     */
    binary: function(encoded) {
        try {
            // Remove whitespace and split into bytes
            const binBytes = encoded.trim().replace(/\s+/g, ' ').split(' ');
            
            return binBytes
                .map(bin => String.fromCharCode(parseInt(bin, 2)))
                .join('');
        } catch (error) {
            console.error('Binary decoding error:', error);
            throw new Error('Failed to decode binary: Invalid input');
        }
    },
    
    /**
     * Decode octal text
     * @param {string} encoded - Octal encoded text
     * @returns {string} - Decoded text
     */
    octal: function(encoded) {
        try {
            // Remove whitespace and split into bytes
            const octBytes = encoded.trim().replace(/\s+/g, ' ').split(' ');
            
            return octBytes
                .map(oct => String.fromCharCode(parseInt(oct, 8)))
                .join('');
        } catch (error) {
            console.error('Octal decoding error:', error);
            throw new Error('Failed to decode octal: Invalid input');
        }
    },
    
    /**
     * Decode ROT13 text
     * @param {string} encoded - ROT13 encoded text
     * @returns {string} - Decoded text
     */
    rot13: function(encoded) {
        // ROT13 is its own inverse, so encoding function works for decoding as well
        return encoders.rot13(encoded);
    },
    
    /**
     * Decode ROT-N text
     * @param {string} encoded - ROT-N encoded text
     * @param {number} shift - Shift value
     * @returns {string} - Decoded text
     */
    'rot-n': function(encoded, shift = 13) {
        try {
            shift = parseInt(shift, 10);
            if (isNaN(shift)) shift = 13;
            
            // To decode, we need to go the other way around the alphabet
            const inverseShift = 26 - (shift % 26);
            return encoders['rot-n'](encoded, inverseShift);
        } catch (error) {
            console.error('ROT-N decoding error:', error);
            throw new Error('Failed to decode ROT-N');
        }
    },
    
    /**
     * Decode Caesar cipher text
     * @param {string} encoded - Caesar cipher encoded text
     * @param {number} shift - Shift value
     * @returns {string} - Decoded text
     */
    caesar: function(encoded, shift = 3) {
        try {
            // To decode Caesar cipher, we need to go the other way around the alphabet
            const inverseShift = 26 - (shift % 26);
            return encoders['rot-n'](encoded, inverseShift);
        } catch (error) {
            console.error('Caesar cipher decoding error:', error);
            throw new Error('Failed to decode Caesar cipher');
        }
    },
    
    /**
     * Decode Vigenère cipher text
     * @param {string} encoded - Vigenère cipher encoded text
     * @param {string} key - Cipher key
     * @returns {string} - Decoded text
     */
    vigenere: function(encoded, key = '') {
        try {
            if (!key) throw new Error('Vigenère cipher requires a key');
            
            // Filter key to only include letters
            key = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
            if (key.length === 0) throw new Error('Vigenère cipher key must contain letters');
            
            let result = '';
            let keyIndex = 0;
            
            for (let i = 0; i < encoded.length; i++) {
                const char = encoded[i];
                const code = char.charCodeAt(0);
                
                // Only decode letters
                if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                    const isUpperCase = code >= 65 && code <= 90;
                    const baseCode = isUpperCase ? 65 : 97;
                    const keyChar = key[keyIndex % key.length];
                    const keyShift = keyChar.charCodeAt(0) - 65; // A=0, B=1, etc.
                    
                    // Apply inverse Vigenère shift
                    const shifted = (code - baseCode - keyShift + 26) % 26 + baseCode;
                    result += String.fromCharCode(shifted);
                    
                    keyIndex++;
                } else {
                    result += char;
                }
            }
            
            return result;
        } catch (error) {
            console.error('Vigenère cipher decoding error:', error);
            throw new Error('Failed to decode Vigenère cipher: ' + error.message);
        }
    },
    
    /**
     * Decode Morse code
     * @param {string} encoded - Morse code
     * @returns {string} - Decoded text
     */
    morse: function(encoded) {
        try {
            const morseCodeMap = {
                '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
                '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
                '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
                '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
                '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
                '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
                '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
                '-----': '0', '.-.-.-': '.', '--..--': ',', '..--..': '?',
                '.----.': "'", '-.-.--': '!', '-..-.': '/', '-.--.': '(',
                '-.--.-': ')', '.-...': '&', '---...': ':', '-.-.-.': ';',
                '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_',
                '.-..-.': '"', '...-..-': '$', '.--.-.': '@'
            };
            
            // Split by words (triple space) and then by characters (single space)
            return encoded
                .split('   ')
                .map(word => {
                    return word
                        .split(' ')
                        .map(symbol => morseCodeMap[symbol] || symbol)
                        .join('');
                })
                .join(' ');
        } catch (error) {
            console.error('Morse code decoding error:', error);
            throw new Error('Failed to decode Morse code');
        }
    }
};

// Export decoders for use in other modules
window.decoders = decoders;
