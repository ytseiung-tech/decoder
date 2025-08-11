/**
 * Main JavaScript file for the decoder application
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    initApp();
});

/**
 * Initialize the decoder application
 */
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Update the method description and option controls for the default method
    const defaultMethod = DOM.decodeMethod.value;
    utils.updateMethodDescription(defaultMethod);
    utils.updateOptionControls(defaultMethod);
}

/**
 * Set up event listeners for UI elements
 */
function setupEventListeners() {
    // Method selection change
    DOM.decodeMethod.addEventListener('change', event => {
        const method = event.target.value;
        utils.updateMethodDescription(method);
        utils.updateOptionControls(method);
    });
    
    // Encode button click
    DOM.encodeBtn.addEventListener('click', () => {
        processInput('encode');
    });
    
    // Decode button click
    DOM.decodeBtn.addEventListener('click', () => {
        processInput('decode');
    });
    
    // Try All Methods button click
    DOM.tryAllBtn.addEventListener('click', () => {
        tryAllDecodeMethods();
    });
    
    // Clear button click
    DOM.clearBtn.addEventListener('click', () => {
        DOM.inputText.value = '';
        DOM.outputText.value = '';
        DOM.fileUpload.value = '';
        DOM.fileInfo.textContent = 'No file selected';
        
        // Reset stats
        if (DOM.charCount) DOM.charCount.textContent = '0 characters';
        if (DOM.outputType) DOM.outputType.textContent = 'No conversion yet';
    });
    
    // Copy button click
    DOM.copyBtn.addEventListener('click', () => {
        const outputText = DOM.outputText.value;
        if (outputText) {
            utils.copyToClipboard(outputText);
        }
    });
    
    // Tab buttons click
    DOM.tabButtons.forEach(button => {
        button.addEventListener('click', event => {
            const tabId = event.target.getAttribute('data-tab');
            
            // Update active tab button
            DOM.tabButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Update active tab pane
            DOM.tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // File upload handling
    DOM.fileUpload.addEventListener('change', event => {
        const file = event.target.files[0];
        if (file) {
            DOM.fileInfo.textContent = `Selected file: ${file.name} (${formatFileSize(file.size)})`;
        } else {
            DOM.fileInfo.textContent = 'No file selected';
        }
    });
    
    // Drag and drop handling
    const fileDropArea = DOM.fileUploadArea;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => {
            fileDropArea.classList.add('dragover');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => {
            fileDropArea.classList.remove('dragover');
        });
    });
    
    fileDropArea.addEventListener('drop', event => {
        const file = event.dataTransfer.files[0];
        if (file) {
            DOM.fileUpload.files = event.dataTransfer.files;
            DOM.fileInfo.textContent = `Selected file: ${file.name} (${formatFileSize(file.size)})`;
        }
    });
}

/**
 * Process input for encoding or decoding
 * @param {string} action - 'encode' or 'decode'
 */
async function processInput(action) {
    try {
        const method = DOM.decodeMethod.value;
        const activeTab = document.querySelector('.tab-pane.active').id;
        
        let input;
        
        if (activeTab === 'text-input') {
            input = DOM.inputText.value;
            if (!input) {
                utils.showError('Please enter text to ' + action, DOM.inputText);
                return;
            }
        } else if (activeTab === 'file-input') {
            const file = DOM.fileUpload.files[0];
            if (!file) {
                utils.showError('Please select a file', DOM.fileUploadArea);
                return;
            }
            
            // Read file content
            try {
                input = await utils.readFileAsText(file);
            } catch (error) {
                utils.showError('Error reading file: ' + error.message, DOM.fileUploadArea);
                return;
            }
        }
        
        let result;
        
        if (action === 'encode') {
            result = encodeInput(input, method);
        } else {
            result = decodeInput(input, method);
        }
        
        DOM.outputText.value = result;
        
        // Update output stats
        updateOutputStats(result, method, action);
        
    } catch (error) {
        console.error('Processing error:', error);
        utils.showError(error.message, DOM.outputText);
    }
}

/**
 * Update output statistics
 * @param {string} output - Output text
 * @param {string} method - Encoding/decoding method
 * @param {string} action - 'encode' or 'decode'
 */
function updateOutputStats(output, method, action) {
    const charCountEl = document.getElementById('char-count');
    const outputTypeEl = document.getElementById('output-type');
    
    if (!charCountEl || !outputTypeEl) return;
    
    // Update character count
    const count = output.length;
    charCountEl.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    
    // Update output type
    const methodName = document.querySelector(`option[value="${method}"]`).textContent;
    outputTypeEl.textContent = `${action === 'encode' ? 'Encoded to' : 'Decoded from'} ${methodName}`;
}

/**
 * Encode input using selected method
 * @param {string} input - Text to encode
 * @param {string} method - Encoding method
 * @returns {string} - Encoded text
 */
function encodeInput(input, method) {
    if (!encoders[method]) {
        throw new Error(`Encoding method '${method}' not supported`);
    }
    
    // Get any additional options based on the method
    let options = {};
    
    switch (method) {
        case 'rot-n':
        case 'caesar':
            const shiftInput = document.getElementById('shift-value');
            options.shift = shiftInput ? shiftInput.value : 13;
            break;
            
        case 'vigenere':
            const keyInput = document.getElementById('vigenere-key');
            options.key = keyInput ? keyInput.value : '';
            break;
    }
    
    if (method === 'rot-n' || method === 'caesar') {
        return encoders[method](input, options.shift);
    } else if (method === 'vigenere') {
        return encoders[method](input, options.key);
    } else {
        return encoders[method](input);
    }
}

/**
 * Decode input using selected method
 * @param {string} input - Text to decode
 * @param {string} method - Decoding method
 * @returns {string} - Decoded text
 */
function decodeInput(input, method) {
    if (!decoders[method]) {
        throw new Error(`Decoding method '${method}' not supported`);
    }
    
    // Get any additional options based on the method
    let options = {};
    
    switch (method) {
        case 'rot-n':
        case 'caesar':
            const shiftInput = document.getElementById('shift-value');
            options.shift = shiftInput ? shiftInput.value : 13;
            break;
            
        case 'vigenere':
            const keyInput = document.getElementById('vigenere-key');
            options.key = keyInput ? keyInput.value : '';
            break;
    }
    
    if (method === 'rot-n' || method === 'caesar') {
        return decoders[method](input, options.shift);
    } else if (method === 'vigenere') {
        return decoders[method](input, options.key);
    } else {
        return decoders[method](input);
    }
}

/**
 * Format file size in a human-readable format
 * @param {number} size - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Add keyboard shortcuts for encode/decode
document.addEventListener('keydown', event => {
    // Ctrl+Enter or Cmd+Enter to encode
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        processInput('encode');
    }
    
    // Shift+Enter to decode
    if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        processInput('decode');
    }
    
    // Alt+Enter to try all methods
    if (event.altKey && event.key === 'Enter') {
        event.preventDefault();
        tryAllDecodeMethods();
    }
});

/**
 * Try decoding the input using all available methods
 */
function tryAllDecodeMethods() {
    try {
        console.log("Starting tryAllDecodeMethods function");
        
        const input = DOM.inputText.value;
        
        if (!input) {
            utils.showError('Please enter text to decode', DOM.inputText);
            return;
        }
        
        // Create an empty container for results
        let results = [];
        
    // Get all decode method options
    const methods = Array.from(DOM.decodeMethod.options).map(option => option.value);
    console.log("Available methods:", methods);
    
    // Ensure all required methods are included
    const requiredMethods = [
        'base64', 'base32', 'base58', 'base85',
        'url', 'html', 'unicode', 
        'hex', 'binary', 'octal',
        'rot13', 'rot-n', 'caesar', 'morse'
        // 'vigenere' is excluded as it requires a key
    ];
    
    // Check if any required methods are missing
    const missingMethods = requiredMethods.filter(method => !methods.includes(method));
    if (missingMethods.length > 0) {
        console.warn("Missing required methods:", missingMethods);
    }
    
    // Add special variants for common formats
    // Make sure we explicitly cover all requested methods:
    // Base64, Base32, Base58, Base85, URL Encoding, HTML Entity, Unicode Escape,
    // Hex (十六進制), Binary (二進制), Octal (八進制), ROT1~13, 
    // Caesar Cipher (shifts 1~25), Morse Code
    // Note: Vigenère Cipher is excluded as it requires a specific key
    
    // Try Base64 with different paddings
    try {
        // Check if input looks like base64 (only contains valid base64 chars)
        const base64Regex = /^[A-Za-z0-9+/\-_]+={0,2}$/;
        if (base64Regex.test(input)) {
            // For standard Base64 format
            if (/^[A-Za-z0-9+/]+={0,2}$/.test(input)) {
                // Try different padding variants only if the current one doesn't work
                try {
                    // Try standard decoder first
                    const standardResult = Base64.decode(input);
                    if (standardResult && utils.isReadableText(standardResult)) {
                        // Only add the result once using the standard method
                        // We'll skip the "adjusted padding" variants if standard decode works
                        console.log("Standard Base64 decode successful");
                    } else {
                        // If standard decode didn't produce readable text, try padding adjustments
                        const base = input.replace(/=+$/, '');
                        for (let i = 0; i <= 2; i++) {
                            const paddedInput = base + '='.repeat(i);
                            if (paddedInput !== input) {
                                try {
                                    const result = Base64.decode(paddedInput);
                                    if (result && utils.isReadableText(result)) {
                                        results.push({
                                            method: `Base64 (padding=${i})`,
                                            result: result,
                                            score: utils.scoreReadability(result) + 5
                                        });
                                    }
                                } catch (e) {
                                    // Ignore errors
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Error in standard Base64 decode:", e);
                }
            }
            
            // For URL-safe Base64 format (with - and _ instead of + and /)
            if (/^[A-Za-z0-9_\-]+={0,2}$/.test(input)) {
                try {
                    const urlSafeInput = input.replace(/-/g, '+').replace(/_/g, '/');
                    // Only try URL-safe if it's different from the input
                    if (urlSafeInput !== input) {
                        const result = Base64.decode(urlSafeInput);
                        if (result && utils.isReadableText(result)) {
                            results.push({
                                method: 'URL-safe Base64',
                                result: result,
                                score: utils.scoreReadability(result) + 5
                            });
                        }
                    }
                } catch (e) {
                    // Ignore errors
                }
            }
        }
        
        // Try hex with different formats
        if (input.match(/^([0-9A-Fa-f]{2}[^0-9A-Fa-f]?)+$/)) {
            // Try with spaces or other separators removed
            try {
                const cleanHex = input.replace(/[^0-9A-Fa-f]/g, '');
                const result = window.decoders.hex(cleanHex);
                if (result && utils.isReadableText(result)) {
                    results.push({
                        method: 'Hex (cleaned)',
                        result: result,
                        score: utils.scoreReadability(result) + 3
                    });
                }
            } catch (e) {
                // Ignore errors
            }
        }
        
        // Try binary with different formats
        if (input.match(/^([01]{8}[^01]?)+$/)) {
            // Try with spaces or other separators removed
            try {
                const cleanBinary = input.replace(/[^01]/g, '');
                const result = window.decoders.binary(cleanBinary);
                if (result && utils.isReadableText(result)) {
                    results.push({
                        method: 'Binary (cleaned)',
                        result: result,
                        score: utils.scoreReadability(result) + 3
                    });
                }
            } catch (e) {
                // Ignore errors
            }
        }
    } catch (e) {
        console.log("Error in special variant checks:", e);
    }    // Try each method
    for (const method of methods) {
        try {
            // Set default options for methods that need them
            let options = {};
            switch (method) {
                case 'rot-n':
                    // Try ROT-N with emphasis on ROT1~13
                    for (let shift = 1; shift <= 25; shift++) {
                        try {
                            const result = window.decoders[method](input, shift);
                            if (result && result !== input) {
                                const readabilityScore = utils.scoreReadability(result);
                                
                                // Label appropriately with emphasis on ROT1~13
                                let methodName;
                                if (shift <= 13) {
                                    // Highlight ROT1~13 range specially
                                    methodName = `ROT-${shift} (ROT1~13 Range)`;
                                    // Special case for ROT13
                                    if (shift === 13) {
                                        methodName = `ROT13 (ROT-${shift})`;
                                    }
                                } else {
                                    methodName = `ROT-${shift}`;
                                }
                                
                                // Include all results but rank them by score
                                // Give higher scores to the ROT1~13 range
                                let adjustedScore = readabilityScore;
                                if (shift <= 13) {
                                    adjustedScore += 5; // Prioritize ROT1~13 range
                                }
                                
                                results.push({
                                    method: methodName,
                                    result: result,
                                    score: adjustedScore
                                });
                            }
                        } catch (error) {
                            console.error(`Error in ${method} (shift=${shift}):`, error);
                            // Skip failed attempts
                        }
                    }
                    continue;
                    
                case 'caesar':
                    // Try Caesar Cipher with shifts 1~25
                    for (let shift = 1; shift <= 25; shift++) {
                        try {
                            const result = window.decoders[method](input, shift);
                            if (result && result !== input) {
                                const readabilityScore = utils.scoreReadability(result);
                                
                                // Label clearly as Caesar Cipher with specific shift
                                const methodName = `Caesar Cipher (Shift=${shift})`;
                                
                                // Include all results but rank them by score
                                results.push({
                                    method: methodName,
                                    result: result,
                                    score: readabilityScore
                                });
                            }
                        } catch (error) {
                            console.error(`Error in ${method} (shift=${shift}):`, error);
                            // Skip failed attempts
                        }
                    }
                    continue;
                    
                case 'vigenere':
                    // Skip Vigenère cipher in try all methods as it requires a specific key
                    // We can't guess the key automatically in the "try all" flow
                    console.log("Skipping Vigenère Cipher in Try All Methods (requires a key)");
                    continue;
            }
            
            // Get proper method display name
            let methodDisplayName;
            switch (method) {
                case 'base64':
                    methodDisplayName = "Base64";
                    break;
                case 'base32':
                    methodDisplayName = "Base32";
                    break;
                case 'base58':
                    methodDisplayName = "Base58";
                    break;
                case 'base85':
                    methodDisplayName = "Base85";
                    break;
                case 'url':
                    methodDisplayName = "URL Encoding";
                    break;
                case 'html':
                    methodDisplayName = "HTML Entity";
                    break;
                case 'unicode':
                    methodDisplayName = "Unicode Escape";
                    break;
                case 'hex':
                    methodDisplayName = "Hex (十六進制)";
                    break;
                case 'binary':
                    methodDisplayName = "Binary (二進制)";
                    break;
                case 'octal':
                    methodDisplayName = "Octal (八進制)";
                    break;
                case 'rot13':
                    methodDisplayName = "ROT13 (ROT1~13 Range)";
                    break;
                case 'morse':
                    methodDisplayName = "Morse Code";
                    break;
                // Note: rot-n and caesar are handled separately with shift values
                default:
                    // Fallback to the text from the option element
                    methodDisplayName = document.querySelector(`option[value="${method}"]`).textContent;
            }
            
            // Try the standard decode method
            const result = window.decoders[method](input);
            console.log(`Tried ${methodDisplayName}:`, result ? result.substring(0, 50) + "..." : "null");
            
            // Only include results that are different from the input
            if (result && result !== input) {
                const isReadable = utils.isReadableText(result);
                const readabilityScore = utils.scoreReadability(result);
                console.log(`${methodDisplayName} readability:`, isReadable, "score:", readabilityScore);
                
                results.push({
                    method: methodDisplayName,
                    result: result,
                    score: readabilityScore
                });
            }
        } catch (error) {
            console.error(`Error in method ${method}:`, error);
            // Skip methods that throw errors
        }
    }
    
    console.log(`Found ${results.length} results before filtering`);
    
    // Remove duplicate results (same decoded text with different methods)
    const uniqueResults = [];
    const seenOutputs = new Set();
    
    for (const result of results) {
        // Use a truncated version of the result to detect near-duplicates
        const truncatedOutput = result.result.substring(0, 50);
        
        if (!seenOutputs.has(truncatedOutput)) {
            seenOutputs.add(truncatedOutput);
            uniqueResults.push(result);
        } else {
            // If we've seen this result before but the new one has a better method name or score,
            // replace the existing one
            const existing = uniqueResults.find(r => r.result.substring(0, 50) === truncatedOutput);
            if (existing && result.score > existing.score) {
                existing.method = result.method;
                existing.score = result.score;
            }
        }
    }
    
    // Sort unique results by score (still sort for best results first, even if not displaying scores)
    uniqueResults.sort((a, b) => b.score - a.score);
    
    // Further improve sorting by showing short, meaningful results first
    uniqueResults.sort((a, b) => {
        // First by score
        if (Math.abs(b.score - a.score) > 15) return b.score - a.score;
        
        // Then prefer results that aren't too long or too short
        const aLength = a.result.length;
        const bLength = b.result.length;
        
        if (aLength > 200 && bLength < 200) return 1;
        if (bLength > 200 && aLength < 200) return -1;
        if (aLength < 3 && bLength >= 3) return 1;
        if (bLength < 3 && aLength >= 3) return -1;
        
        // Default to score-based sorting
        return b.score - a.score;
    });
    
    console.log(`Found ${uniqueResults.length} unique results after deduplication`);
    
    // Format the output
    let output = '';
    
    if (uniqueResults.length > 0) {
        output = '=== ALL POSSIBLE DECODING RESULTS ===\n\n';
        
        // Show all unique results without scores
        for (let i = 0; i < uniqueResults.length; i++) {
            output += `[${i+1}] ${uniqueResults[i].method}:\n${uniqueResults[i].result}\n\n`;
        }
        
        output += `Total results: ${uniqueResults.length}`;
    } else {
        output = 'No successful decoding found with any method. Try adjusting the input or using a specific method.';
    }
    
    // Display the results
    DOM.outputText.value = output;
    
    // Update output stats
    if (DOM.charCount) DOM.charCount.textContent = `${output.length} characters`;
    if (DOM.outputType) DOM.outputType.textContent = 'Auto-decoded with multiple methods';
    
    // Show method description for Try All Methods
    utils.updateMethodDescription('tryAll');
    
    console.log("Try all methods completed successfully");
    } catch (error) {
        console.error("Error in tryAllDecodeMethods:", error);
        DOM.outputText.value = "An error occurred while trying all methods. Please check the console for details.";
    }
}
