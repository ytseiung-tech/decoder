# Universal Decoder

A comprehensive web-based tool for encoding and decoding various formats, including:

- Base64
- Base32
- Base58
- Base85
- URL Encoding
- HTML Entity
- Unicode Escape
- Hex (十六進制)
- Binary (二進制)
- Octal (八進制)
- ROT13/ROT-N
- Caesar Cipher
- Vigenère Cipher
- Morse Code

## Features

- Text and file input options
- Multiple encoding/decoding methods
- Detailed descriptions for each method
- File upload capability via drag-and-drop or file selector
- Clean and responsive user interface
- Copy to clipboard functionality
- Keyboard shortcuts

## Usage

1. Open `index.html` in your web browser
2. Enter text or upload a file to encode/decode
3. Select your desired encoding/decoding method
4. Click "Encode" or "Decode" button
5. View and copy the results

## Keyboard Shortcuts

- **Ctrl+Enter** (or **Cmd+Enter**): Encode
- **Shift+Enter**: Decode

## Methods

### Base64
Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.

### Base32
Base32 uses a 32-character set (A-Z, 2-7) and is designed to be human-readable.

### Base58
Base58 is used in Bitcoin and other cryptocurrencies, omitting characters that might look similar.

### Base85 (ASCII85)
Base85 is more efficient than Base64, encoding 4 bytes of binary data into 5 ASCII characters.

### URL Encoding
Converts characters that are not allowed in a URL into a format that can be transmitted over the Internet.

### HTML Entity
Special strings that represent characters that might otherwise be interpreted as HTML syntax.

### Unicode Escape
Represents Unicode characters in formats like \u0041 (representing "A").

### Hex (十六進制)
Represents each byte of data as two hexadecimal digits (0-9, A-F).

### Binary (二進制)
Represents data using only two symbols, typically 0 and 1.

### Octal (八進制)
Represents data using the digits 0-7.

### ROT13/ROT-N
A simple letter substitution cipher that replaces a letter with the letter a fixed number of positions later in the alphabet.

### Caesar Cipher
Works by shifting each letter in the plaintext by a fixed number of positions in the alphabet.

### Vigenère Cipher
A method of encrypting text using a series of interwoven Caesar ciphers based on the letters of a keyword.

### Morse Code
A method of encoding text characters as sequences of dots and dashes.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- External libraries:
  - CryptoJS
  - js-base64
  - Font Awesome

## License

MIT
