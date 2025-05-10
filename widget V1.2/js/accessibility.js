/**
 * Accessibility Widget
 * A customizable accessibility widget for websites that provides features like text resizing,
 * text-to-speech, reading mask, dark/light theme mode, and more.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize after a short delay to ensure page has fully loaded
  setTimeout(initAccessibilityWidget, 500);
});

/**
 * Initialize the accessibility widget
 */
function initAccessibilityWidget() {
  // Create a container for themed content
  const themeContainer = document.createElement('div');
  themeContainer.id = 'theme-container';
  
  // Move all body children (except the accessibility widget) into the container
  setupThemeContainer(themeContainer);
  
  // Get main elements
  const toggle = document.getElementById('accessibility-toggle');
  const panel = document.getElementById('accessibility-panel');
  const closeButton = document.getElementById('close-panel');
  const pageMask = document.getElementById('page-mask');
  
  // Feature toggle buttons
  const textSizeBtn = document.getElementById('text-size-btn');
  const textSpacingBtn = document.getElementById('text-spacing-btn');
  const dyslexiaFontBtn = document.getElementById('dyslexia-font-btn');
  const themeModeBtn = document.getElementById('theme-mode-btn');
  const lineHeightBtn = document.getElementById('line-height-btn');
  const pageMaskBtn = document.getElementById('page-mask-btn');
  
  // Feature control panels
  const textSizeControls = document.querySelector('.text-size-controls');
  const textSpacingControls = document.querySelector('.text-spacing-controls');
  const lineHeightControls = document.querySelector('.line-height-controls');
  const pageMaskControls = document.querySelector('.page-mask-controls');
  
  // Feature sliders
  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeValue = document.getElementById('font-size-value');
  const letterSpacingSlider = document.getElementById('letter-spacing-slider');
  const letterSpacingValue = document.getElementById('letter-spacing-value');
  const wordSpacingSlider = document.getElementById('word-spacing-slider');
  const wordSpacingValue = document.getElementById('word-spacing-value');
  const lineHeightSlider = document.getElementById('line-height-slider');
  const lineHeightValue = document.getElementById('line-height-value');
  const maskOpacitySlider = document.getElementById('mask-opacity-slider');
  const maskOpacityValue = document.getElementById('mask-opacity-value');
  const maskColorButtons = document.querySelectorAll('.mask-color');
  
  // Buttons
  const speakButton = document.getElementById('speak-page');
  const stopSpeakingButton = document.getElementById('stop-speaking');
  const resetButton = document.getElementById('reset-accessibility');
  
  // TTS variables
  let speaking = false;
  
  // Dark mode state
  let darkMode = false;
  
  // Initialize panel animation
  initPanelAnimation(toggle, panel, closeButton);
  
  // Initialize text-to-speech
  initTextToSpeech(speakButton, stopSpeakingButton);
  
  // Setup text selection instructions
  setupTextSelectionInstructions(speakButton);
  
  // Text Size
  textSizeBtn.addEventListener('click', function() {
    toggleFeatureWithControls(this, 'enhanced-text-size', textSizeControls);
  });
  
  // Text Spacing
  textSpacingBtn.addEventListener('click', function() {
    toggleFeatureWithControls(this, 'enhanced-text-spacing', textSpacingControls);
  });
  
  // Line Height
  lineHeightBtn.addEventListener('click', function() {
    toggleFeatureWithControls(this, 'enhanced-line-height', lineHeightControls);
  });
  
  // Dyslexia Font
  dyslexiaFontBtn.addEventListener('click', function() {
    toggleFeature(this, 'enhanced-dyslexia-font');
  });
  
  // Page Mask
  pageMaskBtn.addEventListener('click', function() {
    toggleFeatureWithControls(this, 'enhanced-page-mask', pageMaskControls);
    if (this.classList.contains('active')) {
      pageMask.style.display = 'block';
    } else {
      pageMask.style.display = 'none';
    }
  });
  
  // Theme Mode (Dark/Light)
  themeModeBtn.addEventListener('click', function() {
    toggleThemeMode(this);
  });
  
  // Font size slider
  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', function() {
      const value = this.value + '%';
      fontSizeValue.textContent = value;
      document.documentElement.style.setProperty('--a11y-font-size', value);
      savePreference('font-size', value);
    });
  }
  
  // Letter spacing slider
  if (letterSpacingSlider && letterSpacingValue) {
    letterSpacingSlider.addEventListener('input', function() {
      const value = (this.value / 100) + 'em';
      letterSpacingValue.textContent = value;
      document.documentElement.style.setProperty('--a11y-letter-spacing', value);
      savePreference('letter-spacing', value);
    });
  }
  
  // Word spacing slider
  if (wordSpacingSlider && wordSpacingValue) {
    wordSpacingSlider.addEventListener('input', function() {
      const value = (this.value / 100) + 'em';
      wordSpacingValue.textContent = value;
      document.documentElement.style.setProperty('--a11y-word-spacing', value);
      savePreference('word-spacing', value);
    });
  }
  
  // Line height slider
  if (lineHeightSlider && lineHeightValue) {
    lineHeightSlider.addEventListener('input', function() {
      const value = (this.value / 10);
      lineHeightValue.textContent = value;
      document.documentElement.style.setProperty('--a11y-line-height', value);
      savePreference('line-height', value);
    });
  }
  
  // Mask opacity slider
  if (maskOpacitySlider && maskOpacityValue) {
    maskOpacitySlider.addEventListener('input', function() {
      const opacityValue = this.value / 100;
      const currentColorMatch = pageMask.style.backgroundColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/);
      
      if (currentColorMatch) {
        const r = currentColorMatch[1];
        const g = currentColorMatch[2];
        const b = currentColorMatch[3];
        pageMask.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
      } else {
        // Default to black if no color is set
        pageMask.style.backgroundColor = `rgba(0, 0, 0, ${opacityValue})`;
      }
      
      maskOpacityValue.textContent = this.value + '%';
      savePreference('mask-opacity', this.value);
    });
  }
  
  // Mask color options
  maskColorButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      pageMask.style.backgroundColor = color;
      savePreference('mask-color', color);
      
      // Update active state
      maskColorButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  
  // Reset all
  resetButton.addEventListener('click', function() {
    resetAllSettings();
  });
  
  // Load saved preferences
  loadPreferences();
  
  /**
   * Set up the theme container
   * @param {HTMLElement} container - The theme container
   */
  function setupThemeContainer(container) {
    // If container is already in place, no need to set it up again
    if (document.getElementById('theme-container')) {
      return;
    }
    
    // Insert the theme container at the beginning of the body
    document.body.insertBefore(container, document.body.firstChild);
    
    // Move all elements except the widget and the container itself
    Array.from(document.body.children).forEach(child => {
      if (child.id !== 'accessibility-widget' && 
          child.id !== 'page-mask' && 
          child.id !== 'speech-highlight-container' &&
          child.id !== 'theme-container') {
        container.appendChild(child);
      }
    });
    
    // Apply styles to container
    container.style.width = '100%';
    container.style.margin = '0';
    container.style.padding = '0';
  }
  
  /**
   * Initialize panel animation
   * @param {HTMLElement} toggle - The toggle button
   * @param {HTMLElement} panel - The panel element
   * @param {HTMLElement} closeButton - The close button
   */
  function initPanelAnimation(toggle, panel, closeButton) {
    // Open panel with side animation
    toggle.addEventListener('click', function() {
      if (panel.classList.contains('show')) {
        // Start hide animation
        panel.classList.remove('show');
        panel.classList.add('hide');
        
        // After animation completes, hide the panel
        setTimeout(function() {
          panel.classList.remove('hide');
          panel.style.display = 'none';
        }, 300);
      } else {
        // Show panel and start animation
        panel.style.display = 'block';
        panel.classList.add('show');
      }
    });
    
    // Close panel with side animation
    closeButton.addEventListener('click', function() {
      // Start hide animation
      panel.classList.remove('show');
      panel.classList.add('hide');
      
      // After animation completes, hide the panel
      setTimeout(function() {
        panel.classList.remove('hide');
        panel.style.display = 'none';
      }, 300);
    });
  }
  
  /**
   * Toggle feature with associated controls
   * @param {HTMLElement} button - The feature button
   * @param {string} className - The class name to toggle
   * @param {HTMLElement} controls - The controls element to display/hide
   */
  function toggleFeatureWithControls(button, className, controls) {
    const isActive = button.classList.contains('active');
    
    // First hide all control panels
    document.querySelectorAll('.text-size-controls, .text-spacing-controls, .line-height-controls, .page-mask-controls').forEach(element => {
      if (element !== controls) {
        element.style.display = 'none';
      }
    });
    
    if (!isActive) {
      button.classList.add('active');
      // Apply the class to the theme container instead of body to avoid affecting the widget
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add(className);
      } else {
        document.body.classList.add(className);
      }
      if (controls) controls.style.display = 'block';
      savePreference(className, true);
    } else {
      button.classList.remove('active');
      // Remove the class from the theme container
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.remove(className);
      } else {
        document.body.classList.remove(className);
      }
      if (controls) controls.style.display = 'none';
      savePreference(className, false);
    }
  }
  
  /**
   * Toggle feature without controls
   * @param {HTMLElement} button - The button element
   * @param {string} className - The class name to toggle
   */
  function toggleFeature(button, className) {
    const isActive = button.classList.contains('active');
    
    if (!isActive) {
      button.classList.add('active');
      // Apply the class to the theme container instead of body to avoid affecting the widget
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add(className);
      } else {
        document.body.classList.add(className);
      }
      savePreference(className, true);
    } else {
      button.classList.remove('active');
      // Remove the class from the theme container
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.remove(className);
      } else {
        document.body.classList.remove(className);
      }
      savePreference(className, false);
    }
  }
  
  /**
   * Toggle theme mode between light and dark
   * @param {HTMLElement} button - The theme mode button
   */
  function toggleThemeMode(button) {
    const isActive = button.classList.contains('active');
    const label = button.querySelector('.option-label');
    
    if (!isActive) {
      // Activate dark mode
      button.classList.add('active');
      label.textContent = 'Light Mode';
      document.documentElement.classList.add('dark-theme');
      darkMode = true;
      savePreference('theme-mode', 'dark');
    } else {
      // Activate light mode
      button.classList.remove('active');
      label.textContent = 'Dark Mode';
      document.documentElement.classList.remove('dark-theme');
      darkMode = false;
      savePreference('theme-mode', 'light');
    }
  }
  
  /**
   * Setup text selection instructions
   * @param {HTMLElement} speakButton - The speak button
   */
  function setupTextSelectionInstructions(speakButton) {
    const instructions = document.querySelector('.selection-instructions');
    
    // Show instructions when hovering over the speak button
    if (speakButton && instructions) {
      speakButton.addEventListener('mouseenter', function() {
        instructions.style.display = 'block';
      });
      
      speakButton.addEventListener('mouseleave', function() {
        instructions.style.display = 'none';
      });
    }
  }
  
  /**
   * Initialize Text-to-Speech functionality
   * @param {HTMLElement} speakButton - The speak button
   * @param {HTMLElement} stopSpeakingButton - The stop speaking button
   */
  function initTextToSpeech(speakButton, stopSpeakingButton) {
    // Text-to-Speech elements
    const speechSynthesis = window.speechSynthesis;
    
    // TTS settings elements
    const ttsControls = document.querySelector('.tts-controls');
    const voiceOptions = document.querySelectorAll('.voice-option');
    const rateSlider = document.getElementById('tts-rate');
    const rateValue = document.getElementById('tts-rate-value');
    const pitchSlider = document.getElementById('tts-pitch');
    const pitchValue = document.getElementById('tts-pitch-value');
    
    // TTS state variables
    let speaking = false;
    let textElements = [];
    let currentElementIndex = 0;
    let selectedVoice = 'male'; // Default to male voice
    const availableVoices = {};
    
    // Update speech rate display
    if (rateSlider && rateValue) {
      rateSlider.addEventListener('input', function() {
        rateValue.textContent = parseFloat(this.value).toFixed(1);
        savePreference('tts-rate', this.value);
      });
    }
    
    // Update speech pitch display
    if (pitchSlider && pitchValue) {
      pitchSlider.addEventListener('input', function() {
        pitchValue.textContent = parseFloat(this.value).toFixed(1);
        savePreference('tts-pitch', this.value);
      });
    }
    
    // Voice selection
    if (voiceOptions) {
      voiceOptions.forEach(function(option) {
        option.addEventListener('click', function() {
          // Remove active class from all options
          voiceOptions.forEach(function(btn) {
            btn.classList.remove('active');
          });
          
          // Add active class to clicked option
          this.classList.add('active');
          
          // Update selected voice
          selectedVoice = this.getAttribute('data-voice');
          savePreference('tts-voice', selectedVoice);
        });
      });
    }
    
    // Initialize available voices when they're loaded
    if (speechSynthesis) {
      speechSynthesis.onvoiceschanged = function() {
        const voices = speechSynthesis.getVoices();
        
        // Group voices by language
        const englishVoices = voices.filter(function(voice) {
          return voice.lang.includes('en');
        });
        
        if (englishVoices.length > 0) {
          // Try to find a female voice
          const femaleVoice = englishVoices.find(function(voice) {
            const name = voice.name.toLowerCase();
            return name.includes('female') || name.includes('woman') || 
                   name.includes('girl') || name.includes('samantha') || 
                   name.includes('karen') || name.includes('victoria');
          });
          
          // Try to find a male voice
          const maleVoice = englishVoices.find(function(voice) {
            const name = voice.name.toLowerCase();
            return name.includes('male') || name.includes('man') || 
                   name.includes('guy') || name.includes('david') || 
                   name.includes('tom') || name.includes('daniel');
          });
          
          // Set available voices with fallbacks
          if (maleVoice) {
            availableVoices.male = maleVoice;
          } else {
            availableVoices.male = englishVoices[0];
          }
          
          if (femaleVoice) {
            availableVoices.female = femaleVoice;
          } else if (englishVoices.length > 1) {
            availableVoices.female = englishVoices[1];
          } else {
            availableVoices.female = englishVoices[0];
          }
        }
      };
      
      // Trigger voice loading
      speechSynthesis.getVoices();
    }
    
    // Show voice controls when 'Read Text' is clicked
    if (speakButton) {
      speakButton.addEventListener('click', function() {
        // Always show the voice controls when Read Text is clicked
        if (ttsControls) ttsControls.style.display = 'block';
        
        // Check if there's selected text to read
        const selectedText = getSelectedText();
        
        if (selectedText) {
          // If there's selected text, read that
          readSelectedText(selectedText);
        } else {
          // Otherwise read visible elements
          readVisibleContent();
        }
      });
    }
    
    // Hide voice controls when 'Stop Speech' is clicked
    if (stopSpeakingButton) {
      stopSpeakingButton.addEventListener('click', function() {
        if (speechSynthesis) {
          // Stop the speech
          speechSynthesis.cancel();
          speaking = false;
          removeHighlighting();
          
          // Hide voice controls
          if (ttsControls) ttsControls.style.display = 'none';
        }
      });
    }
    
    /**
     * Get selected text
     * @returns {string} Selected text
     */
    function getSelectedText() {
      return window.getSelection().toString();
    }
    
    /**
     * Read selected text
     * @param {string} text - Text to read
     */
    function readSelectedText(text) {
      if (!speechSynthesis || !text) return;
      
      // Cancel any current speech
      speechSynthesis.cancel();
      
      // Create utterance for selected text
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on selection
      if (availableVoices[selectedVoice]) {
        utterance.voice = availableVoices[selectedVoice];
      }
      
      // Set rate and pitch
      if (rateSlider) utterance.rate = parseFloat(rateSlider.value);
      if (pitchSlider) utterance.pitch = parseFloat(pitchSlider.value);
      
      // Speak the selected text
      speechSynthesis.speak(utterance);
      speaking = true;
    }
    
    /**
     * Read visible content function (for when no text is selected)
     */
    function readVisibleContent() {
      if (!speechSynthesis) return;
      
      // Cancel any current speech
      speechSynthesis.cancel();
      
      // Get visible text elements
      textElements = getVisibleTextElements();
      currentElementIndex = 0;
      
      if (textElements.length > 0) {
        speakVisibleElements();
      }
    }
    
    /**
     * Get visible text elements on screen
     * @returns {Array} Array of visible text elements
     */
    function getVisibleTextElements() {
      const elements = [];
      
      // Common text element selectors
      const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 
        '.text-block', '.content-text', '.text-content',
        '.block-text', '.block-content', '.content'
      ];
      
      // Try to identify content containers
      const contentContainers = document.querySelectorAll('.page-container, .block, .content-block, .text-block');
      
      // If content containers found, prioritize content within them
      if (contentContainers.length > 0) {
        contentContainers.forEach(function(container) {
          const containerElements = container.querySelectorAll(selectors.join(', '));
          containerElements.forEach(function(el) {
            if (isElementVisible(el) && !el.closest('#accessibility-widget')) {
              elements.push(el);
            }
          });
        });
      } else {
        // Fallback to searching the whole document
        document.querySelectorAll(selectors.join(', ')).forEach(function(el) {
          if (isElementVisible(el) && !el.closest('#accessibility-widget')) {
            elements.push(el);
          }
        });
      }
      
      return elements;
    }
    
    /**
     * Check if element is visible in viewport
     * @param {HTMLElement} el - Element to check
     * @returns {boolean} True if element is visible
     */
    function isElementVisible(el) {
      if (!el) return false;
      
      // Check if element or parent is hidden
      if (el.offsetParent === null) return false;
      
      // Check if element has content
      if (!el.textContent.trim()) return false;
      
      // Get element position
      const rect = el.getBoundingClientRect();
      
      // Check if element is in viewport
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    
    /**
     * Speak visible elements one at a time
     */
    function speakVisibleElements() {
      if (currentElementIndex >= textElements.length) {
        speaking = false;
        return;
      }
      
      const element = textElements[currentElementIndex];
      const text = element.textContent.trim();
      
      // Skip empty content
      if (!text) {
        currentElementIndex++;
        speakVisibleElements();
        return;
      }
      
      // Highlight current element
      removeHighlighting();
      element.classList.add('speech-highlight');
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on selection
      if (availableVoices[selectedVoice]) {
        utterance.voice = availableVoices[selectedVoice];
      }
      
      // Set rate and pitch
      if (rateSlider) utterance.rate = parseFloat(rateSlider.value);
      if (pitchSlider) utterance.pitch = parseFloat(pitchSlider.value);
      
      // When finished speaking this element, move to next
      utterance.onend = function() {
        currentElementIndex++;
        
        // Small delay before next element
        setTimeout(function() {
          if (speaking) {
            speakVisibleElements();
          }
        }, 250);
      };
      
      // Speak the element
      speechSynthesis.speak(utterance);
      speaking = true;
      
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Load saved TTS preferences
     */
    function loadTTSPreferences() {
      // Initially hide the TTS controls
      if (ttsControls) ttsControls.style.display = 'none';
      
      // Load voice preference
      const savedVoice = localStorage.getItem('tts-voice');
      if (savedVoice && voiceOptions) {
        selectedVoice = savedVoice;
        
        // Update voice button states
        voiceOptions.forEach(function(btn) {
          if (btn.getAttribute('data-voice') === savedVoice) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      } else if (voiceOptions) {
        // Default to male voice if no preference saved
        voiceOptions.forEach(function(btn) {
          if (btn.getAttribute('data-voice') === 'male') {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
      
      // Load rate
      const savedRate = localStorage.getItem('tts-rate');
      if (savedRate && rateSlider && rateValue) {
        rateSlider.value = savedRate;
        rateValue.textContent = parseFloat(savedRate).toFixed(1);
      }
      
      // Load pitch
      const savedPitch = localStorage.getItem('tts-pitch');
      if (savedPitch && pitchSlider && pitchValue) {
        pitchSlider.value = savedPitch;
        pitchValue.textContent = parseFloat(savedPitch).toFixed(1);
      }
    }
    
    // Load TTS preferences
    loadTTSPreferences();
    
    // Add listener for text selection
    document.addEventListener('mouseup', function() {
      const selectedText = getSelectedText();
      if (selectedText.length > 0 && speakButton) {
        // If text is selected, make Read Text button more prominent
        speakButton.classList.add('text-selected');
      } else if (speakButton) {
        speakButton.classList.remove('text-selected');
      }
    });
  }
  
  /**
   * Remove highlighting (used by reset button)
   */
  function removeHighlighting() {
    document.querySelectorAll('.speech-highlight').forEach(function(el) {
      el.classList.remove('speech-highlight');
    });
  }
  
  /**
   * Reset all settings
   */
  function resetAllSettings() {
    // Stop speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speaking = false;
      removeHighlighting();
    }
    
    // Get buttons and controls
    const buttons = document.querySelectorAll('.option-button');
    const controls = document.querySelectorAll('.text-size-controls, .text-spacing-controls, .line-height-controls, .page-mask-controls, .tts-controls');
    const pageMask = document.getElementById('page-mask');
    const themeModeBtn = document.getElementById('theme-mode-btn');
    
    // Reset all buttons
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    
    // Hide all controls
    controls.forEach(function(ctrl) {
      ctrl.style.display = 'none';
    });
    
    // Hide page mask
    if (pageMask) pageMask.style.display = 'none';
    
    // Reset theme mode button label
    if (themeModeBtn) {
      themeModeBtn.querySelector('.option-label').textContent = 'Dark Mode';
    }
    
    // Remove enhanced classes from theme container
    const themeContainer = document.getElementById('theme-container');
    if (themeContainer) {
      themeContainer.classList.remove(
        'enhanced-text-size',
        'enhanced-text-spacing',
        'enhanced-line-height',
        'enhanced-dyslexia-font',
        'enhanced-page-mask'
      );
    }
    
    // Remove dark theme
    document.documentElement.classList.remove('dark-theme');
    darkMode = false;
    
    // Reset CSS variables
    document.documentElement.style.setProperty('--a11y-font-size', '120%');
    document.documentElement.style.setProperty('--a11y-letter-spacing', '0.12em');
    document.documentElement.style.setProperty('--a11y-word-spacing', '0.16em');
    document.documentElement.style.setProperty('--a11y-line-height', '1.8');
    
    // Reset sliders
    resetSliders();
    
    // Clear saved preferences
    clearPreferences();
  }
  
  /**
   * Reset all sliders to default values
   */
  function resetSliders() {
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const letterSpacingSlider = document.getElementById('letter-spacing-slider');
    const letterSpacingValue = document.getElementById('letter-spacing-value');
    const wordSpacingSlider = document.getElementById('word-spacing-slider');
    const wordSpacingValue = document.getElementById('word-spacing-value');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const lineHeightValue = document.getElementById('line-height-value');
    const maskOpacitySlider = document.getElementById('mask-opacity-slider');
    const maskOpacityValue = document.getElementById('mask-opacity-value');
    const pageMask = document.getElementById('page-mask');
    
    // Reset text size
    if (fontSizeSlider && fontSizeValue) {
      fontSizeSlider.value = 120;
      fontSizeValue.textContent = '120%';
    }
    
    // Reset letter spacing
    if (letterSpacingSlider && letterSpacingValue) {
      letterSpacingSlider.value = 12;
      letterSpacingValue.textContent = '0.12em';
    }
    
    // Reset word spacing
    if (wordSpacingSlider && wordSpacingValue) {
      wordSpacingSlider.value = 16;
      wordSpacingValue.textContent = '0.16em';
    }
    
   // Reset line height
   if (lineHeightSlider && lineHeightValue) {
    lineHeightSlider.value = 18;
    lineHeightValue.textContent = '1.8';
  }
  
  // Reset mask opacity and color
  if (maskOpacitySlider && maskOpacityValue) {
    maskOpacitySlider.value = 50;
    maskOpacityValue.textContent = '50%';
    if (pageMask) pageMask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  }
  
  // Reset mask color buttons
  const maskColorButtons = document.querySelectorAll('.mask-color');
  if (maskColorButtons && maskColorButtons.length > 0) {
    maskColorButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    
    maskColorButtons[0].classList.add('active');
  }
  
  // Reset TTS settings
  const voiceOptions = document.querySelectorAll('.voice-option');
  const rateSlider = document.getElementById('tts-rate');
  const rateValue = document.getElementById('tts-rate-value');
  const pitchSlider = document.getElementById('tts-pitch');
  const pitchValue = document.getElementById('tts-pitch-value');
  
  if (voiceOptions) {
    voiceOptions.forEach(function(option) {
      option.classList.remove('active');
    });
    
    // Set male as default
    voiceOptions.forEach(function(option) {
      if (option.getAttribute('data-voice') === 'male') {
        option.classList.add('active');
      }
    });
  }
  
  if (rateSlider && rateValue) {
    rateSlider.value = 1;
    rateValue.textContent = '1.0';
  }
  
  if (pitchSlider && pitchValue) {
    pitchSlider.value = 1;
    pitchValue.textContent = '1.0';
  }
  
  // Reset text selection indicator
  const speakButton = document.getElementById('speak-page');
  if (speakButton) speakButton.classList.remove('text-selected');
}

/**
 * Helper function to save preferences
 * @param {string} key - Preference key
 * @param {*} value - Preference value
 */
function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.log('Unable to save preference');
  }
}

/**
 * Helper function to load preferences
 */
function loadPreferences() {
  try {
    // Load text size
    if (localStorage.getItem('enhanced-text-size') === 'true') {
      const textSizeBtn = document.getElementById('text-size-btn');
      const textSizeControls = document.querySelector('.text-size-controls');
      
      if (textSizeBtn) textSizeBtn.classList.add('active');
      
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add('enhanced-text-size');
      }
      
      if (textSizeControls) textSizeControls.style.display = 'block';
      
      // Load custom font size
      const savedFontSize = localStorage.getItem('font-size');
      if (savedFontSize) {
        document.documentElement.style.setProperty('--a11y-font-size', savedFontSize);
        
        const fontSizeValue = document.getElementById('font-size-value');
        const fontSizeSlider = document.getElementById('font-size-slider');
        
        if (fontSizeValue) fontSizeValue.textContent = savedFontSize;
        if (fontSizeSlider) fontSizeSlider.value = parseInt(savedFontSize);
      }
    }
    
    // Load text spacing
    if (localStorage.getItem('enhanced-text-spacing') === 'true') {
      const textSpacingBtn = document.getElementById('text-spacing-btn');
      const textSpacingControls = document.querySelector('.text-spacing-controls');
      
      if (textSpacingBtn) textSpacingBtn.classList.add('active');
      
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add('enhanced-text-spacing');
      }
      
      if (textSpacingControls) textSpacingControls.style.display = 'block';
      
      // Load custom letter spacing
      const savedLetterSpacing = localStorage.getItem('letter-spacing');
      if (savedLetterSpacing) {
        document.documentElement.style.setProperty('--a11y-letter-spacing', savedLetterSpacing);
        
        const letterSpacingValue = document.getElementById('letter-spacing-value');
        const letterSpacingSlider = document.getElementById('letter-spacing-slider');
        
        if (letterSpacingValue) letterSpacingValue.textContent = savedLetterSpacing;
        if (letterSpacingSlider) letterSpacingSlider.value = parseFloat(savedLetterSpacing) * 100;
      }
      
      // Load custom word spacing
      const savedWordSpacing = localStorage.getItem('word-spacing');
      if (savedWordSpacing) {
        document.documentElement.style.setProperty('--a11y-word-spacing', savedWordSpacing);
        
        const wordSpacingValue = document.getElementById('word-spacing-value');
        const wordSpacingSlider = document.getElementById('word-spacing-slider');
        
        if (wordSpacingValue) wordSpacingValue.textContent = savedWordSpacing;
        if (wordSpacingSlider) wordSpacingSlider.value = parseFloat(savedWordSpacing) * 100;
      }
    }
    
    // Load line height
    if (localStorage.getItem('enhanced-line-height') === 'true') {
      const lineHeightBtn = document.getElementById('line-height-btn');
      const lineHeightControls = document.querySelector('.line-height-controls');
      
      if (lineHeightBtn) lineHeightBtn.classList.add('active');
      
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add('enhanced-line-height');
      }
      
      if (lineHeightControls) lineHeightControls.style.display = 'block';
      
      // Load custom line height
      const savedLineHeight = localStorage.getItem('line-height');
      if (savedLineHeight) {
        document.documentElement.style.setProperty('--a11y-line-height', savedLineHeight);
        
        const lineHeightValue = document.getElementById('line-height-value');
        const lineHeightSlider = document.getElementById('line-height-slider');
        
        if (lineHeightValue) lineHeightValue.textContent = savedLineHeight;
        if (lineHeightSlider) lineHeightSlider.value = parseFloat(savedLineHeight) * 10;
      }
    }
    
    // Load dyslexia font
    if (localStorage.getItem('enhanced-dyslexia-font') === 'true') {
      const dyslexiaFontBtn = document.getElementById('dyslexia-font-btn');
      
      if (dyslexiaFontBtn) dyslexiaFontBtn.classList.add('active');
      
      const themeContainer = document.getElementById('theme-container');
      if (themeContainer) {
        themeContainer.classList.add('enhanced-dyslexia-font');
      }
    }
    
    // Load page mask
    if (localStorage.getItem('enhanced-page-mask') === 'true') {
      const pageMaskBtn = document.getElementById('page-mask-btn');
      const pageMaskControls = document.querySelector('.page-mask-controls');
      const pageMask = document.getElementById('page-mask');
      
      if (pageMaskBtn) pageMaskBtn.classList.add('active');
      if (pageMask) pageMask.style.display = 'block';
      if (pageMaskControls) pageMaskControls.style.display = 'block';
      
      // Load mask opacity
      const savedOpacity = localStorage.getItem('mask-opacity');
      if (savedOpacity) {
        const opacityValue = parseInt(savedOpacity) / 100;
        
        const maskOpacityValue = document.getElementById('mask-opacity-value');
        const maskOpacitySlider = document.getElementById('mask-opacity-slider');
        
        if (maskOpacityValue) maskOpacityValue.textContent = savedOpacity + '%';
        if (maskOpacitySlider) maskOpacitySlider.value = savedOpacity;
        
        // Apply saved opacity to the mask
        const savedColor = localStorage.getItem('mask-color');
        if (savedColor && pageMask) {
          pageMask.style.backgroundColor = savedColor;
        } else if (pageMask) {
          // Default mask color with saved opacity
          pageMask.style.backgroundColor = `rgba(0, 0, 0, ${opacityValue})`;
        }
      }
      
      // Load mask color
      const savedColor = localStorage.getItem('mask-color');
      if (savedColor && pageMask) {
        pageMask.style.backgroundColor = savedColor;
        
        // Update active state of color buttons
        const maskColorButtons = document.querySelectorAll('.mask-color');
        if (maskColorButtons && maskColorButtons.length > 0) {
          maskColorButtons.forEach(function(btn) {
            if (btn.getAttribute('data-color') === savedColor) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }
      }
    }
    
    // Load theme mode
    if (localStorage.getItem('theme-mode') === 'dark') {
      const themeModeBtn = document.getElementById('theme-mode-btn');
      
      if (themeModeBtn) {
        themeModeBtn.classList.add('active');
        const label = themeModeBtn.querySelector('.option-label');
        if (label) label.textContent = 'Light Mode';
      }
      
      document.documentElement.classList.add('dark-theme');
      darkMode = true;
    }
  } catch (e) {
    console.log('Unable to load preferences', e);
  }
}

/**
 * Helper function to clear preferences
 */
function clearPreferences() {
  try {
    localStorage.removeItem('enhanced-text-size');
    localStorage.removeItem('enhanced-text-spacing');
    localStorage.removeItem('enhanced-line-height');
    localStorage.removeItem('enhanced-dyslexia-font');
    localStorage.removeItem('enhanced-page-mask');
    localStorage.removeItem('theme-mode');
    localStorage.removeItem('font-size');
    localStorage.removeItem('letter-spacing');
    localStorage.removeItem('word-spacing');
    localStorage.removeItem('line-height');
    localStorage.removeItem('mask-opacity');
    localStorage.removeItem('mask-color');
    localStorage.removeItem('tts-voice');
    localStorage.removeItem('tts-rate');
    localStorage.removeItem('tts-pitch');
  } catch (e) {
    console.log('Unable to clear preferences');
  }
}
}