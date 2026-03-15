/**
 * security-utils.js
 * Security utility functions for input sanitization and validation.
 * Loaded before main-app.js to ensure availability.
 */
(function () {
  "use strict";

  /**
   * Sanitize HTML string to prevent XSS attacks.
   * Removes all HTML tags and returns safe text content.
   * For cases where HTML structure is needed, use a whitelist approach.
   *
   * @param {string} str - The string to sanitize
   * @param {Object} [options] - Sanitization options
   * @param {boolean} [options.allowBasicFormatting=false] - Allow <b>, <i>, <em>, <strong>, <br>
   * @returns {string} Sanitized string
   */
  function sanitizeHTML(str, options) {
    if (typeof str !== "string") return "";

    var opts = options || {};
    var allowBasic = opts.allowBasicFormatting || false;

    if (!allowBasic) {
      // Strip all HTML tags - return pure text
      var temp = document.createElement("div");
      temp.textContent = str;
      return temp.innerHTML;
    }

    // Whitelist approach: allow only safe formatting tags
    var allowedTags = ["b", "i", "em", "strong", "br", "span", "small"];
    var allowedAttrs = ["class", "style"];

    // First encode everything
    var temp2 = document.createElement("div");
    temp2.textContent = str;
    var encoded = temp2.innerHTML;

    // Then selectively decode allowed tags
    for (var t = 0; t < allowedTags.length; t++) {
      var tag = allowedTags[t];
      // Opening tags with possible attributes
      var openPattern = new RegExp(
        "&lt;" + tag + "(\\s[^&]*?)?&gt;",
        "gi"
      );
      encoded = encoded.replace(openPattern, function (match) {
        // Decode the match and validate attributes
        var decoded = match
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"');

        // Remove disallowed attributes
        decoded = decoded.replace(
          /\s(\w+)=/g,
          function (attrMatch, attrName) {
            if (allowedAttrs.indexOf(attrName.toLowerCase()) !== -1) {
              return attrMatch;
            }
            return " ";
          }
        );

        // Block event handler attributes and javascript: URLs
        if (/on\w+\s*=/i.test(decoded) || /javascript\s*:/i.test(decoded)) {
          return match; // Keep encoded if dangerous
        }
        return decoded;
      });

      // Self-closing tags
      var selfClose = new RegExp("&lt;" + tag + "\\s*/?&gt;", "gi");
      encoded = encoded.replace(selfClose, "<" + tag + ">");

      // Closing tags
      var closePattern = new RegExp(
        "&lt;/" + tag + "&gt;",
        "gi"
      );
      encoded = encoded.replace(closePattern, "</" + tag + ">");
    }

    return encoded;
  }

  /**
   * Validate user input against common security patterns.
   *
   * @param {string} input - The input string to validate
   * @param {Object} [rules] - Validation rules
   * @param {number} [rules.maxLength=500] - Maximum allowed length
   * @param {number} [rules.minLength=0] - Minimum required length
   * @param {string} [rules.type='text'] - Input type: 'text', 'alphanumeric', 'korean', 'email', 'numeric'
   * @param {boolean} [rules.required=false] - Whether input is required
   * @param {RegExp} [rules.pattern] - Custom regex pattern to match
   * @returns {Object} Validation result { valid: boolean, error: string|null, sanitized: string }
   */
  function validateInput(input, rules) {
    var opts = rules || {};
    var maxLength = opts.maxLength || 500;
    var minLength = opts.minLength || 0;
    var type = opts.type || "text";
    var required = opts.required || false;

    var result = { valid: true, error: null, sanitized: "" };

    // Convert to string
    var str = input == null ? "" : String(input).trim();

    // Required check
    if (required && str.length === 0) {
      result.valid = false;
      result.error = "Input is required";
      return result;
    }

    // Allow empty if not required
    if (str.length === 0 && !required) {
      result.sanitized = "";
      return result;
    }

    // Length checks
    if (str.length > maxLength) {
      result.valid = false;
      result.error = "Input exceeds maximum length of " + maxLength;
      return result;
    }

    if (str.length < minLength) {
      result.valid = false;
      result.error = "Input must be at least " + minLength + " characters";
      return result;
    }

    // Type-specific validation
    var patterns = {
      alphanumeric: /^[a-zA-Z0-9\s]+$/,
      korean: /^[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\s]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      numeric: /^[0-9]+$/,
    };

    if (type !== "text" && patterns[type]) {
      if (!patterns[type].test(str)) {
        result.valid = false;
        result.error = "Input does not match expected format: " + type;
        return result;
      }
    }

    // Custom pattern check
    if (opts.pattern && !opts.pattern.test(str)) {
      result.valid = false;
      result.error = "Input does not match required pattern";
      return result;
    }

    // Dangerous pattern detection
    var dangerousPatterns = [
      /<script[\s>]/i,
      /javascript\s*:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
      /url\s*\(\s*['"]?\s*data:/i,
    ];

    for (var d = 0; d < dangerousPatterns.length; d++) {
      if (dangerousPatterns[d].test(str)) {
        result.valid = false;
        result.error = "Input contains potentially dangerous content";
        return result;
      }
    }

    // Sanitize the validated input
    result.sanitized = sanitizeHTML(str);
    return result;
  }

  // Expose to global scope
  window.sanitizeHTML = sanitizeHTML;
  window.validateInput = validateInput;
})();
