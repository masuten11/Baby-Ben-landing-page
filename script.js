// Firebase Configuration - Replace with your actual config
const firebaseConfig = {
 apiKey: "AIzaSyDoI5Z1udti4op0ZteF5ZAEnG7CSmLojA0",
  authDomain: "baby-ben-fan-page.firebaseapp.com",
  projectId: "baby-ben-fan-page",
  storageBucket: "baby-ben-fan-page.firebasestorage.app",
  messagingSenderId: "680033166985",
  appId: "1:680033166985:web:4cc1e4d1f72d06ed2a4858"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Document reference for likes
const likesDocRef = doc(db, 'likes', 'page-likes');

class FanPageFunctionality {
  constructor() {
    this.likeButton = document.getElementById('like-btn');
    this.shareButton = document.getElementById('share-btn');
    this.questionsForm = document.getElementById('questions-form');
    this.currentLikes = 0;
    this.userHasLiked = false;
    
    // Ben 10 character data for matching
    this.ben10Characters = {
      'Ben Tennyson': {
        traits: ['young', 'heroic', 'adventurous', 'cocky', 'creative'],
        ageGroups: ['6–12', '13–17'],
        colors: ['green', 'blue'],
        likes: ['action', 'fun']
      },
      'Gwen Tennyson': {
        traits: ['smart', 'mature', 'magical', 'responsible', 'studious'],
        ageGroups: ['6–12', '13–17', '18–30'],
        colors: ['pink', 'red', 'blue'],
        likes: ['studying', 'books', 'magic']
      },
      'Kevin Levin': {
        traits: ['tough', 'rebellious', 'loyal', 'protective', 'street-smart'],
        ageGroups: ['13–17', '18–30'],
        colors: ['red', 'green', 'blue'],
        likes: ['cars', 'fighting']
      },
      'Max Tennyson': {
        traits: ['wise', 'experienced', 'caring', 'protective', 'knowledgeable'],
        ageGroups: ['30+'],
        colors: ['blue', 'green'],
        likes: ['adventure', 'family']
      },
      'Rook Blonko': {
        traits: ['disciplined', 'loyal', 'professional', 'curious', 'respectful'],
        ageGroups: ['18–30'],
        colors: ['blue', 'green'],
        likes: ['order', 'learning']
      },
      'Vilgax': {
        traits: ['ambitious', 'powerful', 'intimidating', 'strategic', 'ruthless'],
        ageGroups: ['18–30', '30+'],
        colors: ['red', 'green'],
        likes: ['power', 'conquest']
      },
      'Albedo': {
        traits: ['intelligent', 'arrogant', 'competitive', 'jealous', 'scientific'],
        ageGroups: ['13–17', '18–30'],
        colors: ['red', 'yellow'],
        likes: ['science', 'recognition']
      },
      'Azmuth': {
        traits: ['genius', 'wise', 'small', 'grumpy', 'brilliant'],
        ageGroups: ['30+'],
        colors: ['green', 'blue'],
        likes: ['technology', 'peace']
      },
      'Charmcaster': {
        traits: ['magical', 'ambitious', 'complex', 'powerful', 'determined'],
        ageGroups: ['13–17', '18–30'],
        colors: ['pink', 'red'],
        likes: ['magic', 'power']
      },
      'Julie Yamamoto': {
        traits: ['kind', 'understanding', 'patient', 'caring', 'supportive'],
        ageGroups: ['13–17', '18–30'],
        colors: ['pink', 'blue', 'yellow'],
        likes: ['pets', 'peace']
      },
      'Kai Green': {
        traits: ['independent', 'strong', 'adventurous', 'confident', 'skilled'],
        ageGroups: ['13–17', '18–30'],
        colors: ['green', 'blue'],
        likes: ['adventure', 'nature']
      },
      'Professor Paradox': {
        traits: ['mysterious', 'wise', 'eccentric', 'knowledgeable', 'timeless'],
        ageGroups: ['30+'],
        colors: ['blue', 'other'],
        likes: ['time', 'knowledge']
      },
      'Sandra Tennyson': {
        traits: ['caring', 'protective', 'motherly', 'understanding', 'supportive'],
        ageGroups: ['30+'],
        colors: ['pink', 'blue'],
        likes: ['family', 'peace']
      },
      'Carl Tennyson': {
        traits: ['hardworking', 'dedicated', 'caring', 'practical', 'responsible'],
        ageGroups: ['30+'],
        colors: ['blue', 'green'],
        likes: ['work', 'family']
      },
      'Argit': {
        traits: ['sneaky', 'opportunistic', 'clever', 'selfish', 'survivor'],
        ageGroups: ['13–17', '18–30'],
        colors: ['yellow', 'green'],
        likes: ['money', 'schemes']
      },
      'Aggregor': {
        traits: ['powerful', 'ambitious', 'ruthless', 'intelligent', 'determined'],
        ageGroups: ['18–30', '30+'],
        colors: ['red', 'green'],
        likes: ['power', 'absorption']
      },
      'Sunny': {
        traits: ['energetic', 'positive', 'cheerful', 'optimistic', 'friendly'],
        ageGroups: ['6–12', '13–17'],
        colors: ['yellow', 'pink'],
        likes: ['fun', 'friends']
      },
      'Mr. Baumann': {
        traits: ['grumpy', 'hardworking', 'persistent', 'stubborn', 'dedicated'],
        ageGroups: ['30+'],
        colors: ['blue', 'other'],
        likes: ['business', 'routine']
      },
      'Malware': {
        traits: ['vengeful', 'corrupted', 'technological', 'persistent', 'dangerous'],
        ageGroups: ['18–30'],
        colors: ['red', 'green'],
        likes: ['corruption', 'revenge']
      }
    };
    
    this.init();
  }

  async init() {
    await this.setupLikeSystem();
    this.setupShareFunction();
    this.setupFormValidation();
    this.setupEventListeners();
  }

  // Initialize like system and load current count
  async setupLikeSystem() {
    try {
      // Get current like count from Firebase
      const docSnap = await getDoc(likesDocRef);
      
      if (docSnap.exists()) {
        this.currentLikes = docSnap.data().count || 0;
      } else {
        // Create document if it doesn't exist
        await setDoc(likesDocRef, { count: 0 });
        this.currentLikes = 0;
      }

      // Check if user has already liked (using localStorage for simplicity)
      this.userHasLiked = localStorage.getItem('hasLikedBabyBen') === 'true';
      
      this.updateLikeButtonDisplay();
      
    } catch (error) {
      console.error('Error setting up like system:', error);
      // Fallback to local display if Firebase fails
      this.currentLikes = 0;
      this.updateLikeButtonDisplay();
    }
  }

  // Updated updateLikeButtonDisplay to respect disabled state
  updateLikeButtonDisplay() {
    const heartIcon = this.likeButton.querySelector('img');
    
    // Create or update like count span
    let likeCountSpan = this.likeButton.querySelector('.like-count');
    if (!likeCountSpan) {
      likeCountSpan = document.createElement('span');
      likeCountSpan.className = 'like-count';
      this.likeButton.appendChild(likeCountSpan);
    }
    
    likeCountSpan.textContent = this.currentLikes;
  }

  // Handle like button click with proper disable/enable
  async handleLikeClick() {
    // Disable button immediately to prevent double clicks
    this.likeButton.disabled = true;
    this.likeButton.style.opacity = '0.6';
    this.likeButton.style.cursor = 'not-allowed';
    
    try {
        // Like functionality
        await updateDoc(likesDocRef, {
          count: increment(1)
        });
        
        this.currentLikes += 1;
        this.userHasLiked = true;
        localStorage.setItem('hasLikedBabyBen', 'true');
        
        this.updateLikeButtonDisplay();
        this.showFeedback('Thanks for the love! ❤️');
      
    } catch (error) {
      console.error('Error with like operation:', error);
      const action = this.userHasLiked ? 'remove' : 'add';
      this.showFeedback(`Failed to ${action} like. Try again!`, 'error');
      
    } finally {
      // Re-enable button after operation completes
      this.likeButton.disabled = false;
      this.likeButton.style.opacity = '1';
      this.likeButton.style.cursor = 'pointer';
    }
  }

  // Handle share button click with proper disable/enable
  async handleShareClick() {
    // Disable button immediately to prevent double clicks
    this.shareButton.disabled = true;
    this.shareButton.style.opacity = '0.6';
    this.shareButton.style.cursor = 'not-allowed';
    
    try {
      // Get current page URL
      const currentUrl = window.location.href;
      
      // Copy to clipboard using modern API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        this.showFeedback('Link copied to clipboard! 📋');
      } else {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(currentUrl);
        this.showFeedback('Link copied to clipboard! 📋');
      }
      
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      this.showFeedback('Failed to copy link. Please copy manually.', 'error');
      
    } finally {
      // Re-enable button after operation completes
      setTimeout(() => {
        this.shareButton.disabled = false;
        this.shareButton.style.opacity = '1';
        this.shareButton.style.cursor = 'pointer';
      }, 1000); // Small delay to prevent rapid clicking
    }
  }

  // Fallback clipboard copy method for older browsers
  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  }

  // Setup form validation and submission
  setupFormValidation() {
    if (!this.questionsForm) return;
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init("Qx9HJT-of4cevevj0");
    }
  }

  // Validate form data
  validateFormData(formData) {
    const errors = [];
    
    // Check required fields
    if (!formData.get('age')) {
      errors.push('Please select your age group');
    }
    
    if (!formData.get('gender')) {
      errors.push('Please select your gender');
    }
    
    const siblings = formData.get('siblings');
    if (!siblings || siblings < 0) {
      errors.push('Please enter a valid number of siblings');
    }
    
    if (!formData.get('fav-color')) {
      errors.push('Please select your favorite color');
    }
    
    if (!formData.get('love-ben')) {
      errors.push('Please answer if you love Baby Ben');
    }
    
    return errors;
  }

  // Determine Ben 10 character based on answers
  determineCharacter(answers) {
    const { age, gender, siblings, favColor, loveBen, favCharacter } = answers;
    
    // Score each character based on compatibility
    const scores = {};
    
    Object.keys(this.ben10Characters).forEach(character => {
      let score = 0;
      const charData = this.ben10Characters[character];
      
      // Age group compatibility (high weight)
      if (charData.ageGroups.includes(age)) {
        score += 30;
      }
      
      // Color preference compatibility
      if (charData.colors.includes(favColor)) {
        score += 20;
      }
      
      // Special scoring based on answers
      if (loveBen === 'yes') {
        // People who love Baby Ben are more likely to be heroes
        if (['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Julie Yamamoto', 'Sandra Tennyson'].includes(character)) {
          score += 15;
        }
      }
      
      // Family size influence
      const siblingCount = parseInt(siblings);
      if (siblingCount === 0) {
        // Only children might relate to independent characters
        if (['Ben Tennyson', 'Albedo', 'Azmuth', 'Professor Paradox'].includes(character)) {
          score += 10;
        }
      } else if (siblingCount >= 2) {
        // People with multiple siblings might relate to family-oriented characters
        if (['Gwen Tennyson', 'Max Tennyson', 'Sandra Tennyson', 'Carl Tennyson'].includes(character)) {
          score += 10;
        }
      }
      
      // Gender influence (subtle)
      if (gender === 'female') {
        if (['Gwen Tennyson', 'Charmcaster', 'Julie Yamamoto', 'Kai Green', 'Sandra Tennyson'].includes(character)) {
          score += 5;
        }
      }
      
      // Random factor to avoid same results
      score += Math.random() * 10;
      
      scores[character] = score;
    });
    
    // Check if favorite character exists and is valid
    let validFavCharacter = null;
    if (favCharacter && this.ben10Characters[favCharacter]) {
      validFavCharacter = favCharacter;
      // Boost favorite character score but don't guarantee it
      scores[favCharacter] += 25;
    }
    
    // Get top 3 characters
    const sortedCharacters = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const topCharacters = sortedCharacters.slice(0, 3);
    
    // Add randomness to final selection from top candidates
    const finalCharacter = topCharacters[Math.floor(Math.random() * Math.min(3, topCharacters.length))];
    
    return {
      character: finalCharacter,
      hadFavorite: !!validFavCharacter,
      favoriteMatched: validFavCharacter === finalCharacter
    };
  }

  // Handle form submission with proper disable/enable
  async handleFormSubmit(event) {
    event.preventDefault();
    
    // Get submit button and disable immediately
    const submitButton = this.questionsForm.querySelector('#questions-submit-btn');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    
    try {
      const formData = new FormData(this.questionsForm);
      
      // Validate form data
      const errors = this.validateFormData(formData);
      
      if (errors.length > 0) {
        this.showFeedback('Please complete all required fields: ' + errors.join(', '), 'error');
        return;
      }
      
      // Extract form data
      const answers = {
        age: formData.get('age'),
        gender: formData.get('gender'),
        siblings: formData.get('siblings'),
        favColor: formData.get('fav-color'),
        loveBen: formData.get('love-ben'),
        favCharacter: formData.get('fav-character') || ''
      };
      
      // Send email via EmailJS
      await this.sendEmailViaEmailJS(answers);
      
      // Determine character
      const result = this.determineCharacter(answers);
      
      // Show result message
      let message = `I've received your answers and I believe that you're ${result.character}!`;
      
      if (result.hadFavorite && !result.favoriteMatched) {
        message += ` (Though I know you've mentioned ${answers.favCharacter} as your favorite!)`;
      }
      
      this.showCharacterResult(message, result.character);
      
      // Reset form only on success
      this.questionsForm.reset();
      this.showFeedback('Form submitted successfully! 🏃‍♂️');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Try to determine character even if email fails
      try {
        const formData = new FormData(this.questionsForm);
        const answers = {
          age: formData.get('age'),
          gender: formData.get('gender'),
          siblings: formData.get('siblings'),
          favColor: formData.get('fav-color'),
          loveBen: formData.get('love-ben'),
          favCharacter: formData.get('fav-character') || ''
        };
        
        const result = this.determineCharacter(answers);
        let message = `I believe that you're ${result.character}!`;
        
        if (result.hadFavorite && !result.favoriteMatched) {
          message += ` (Though I've noticed you mentioned ${answers.favCharacter} as your favorite!)`;
        }
        
        this.showCharacterResult(message, result.character);
        this.showFeedback('Character determined, but email sending failed. Please try again later.', 'error');
        
      } catch (fallbackError) {
        console.error('Fallback character determination failed:', fallbackError);
        this.showFeedback('There was an error processing your answers. Please try again.', 'error');
      }
      
    } finally {
      // Always re-enable button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  }

  // Send email using EmailJS
  async sendEmailViaEmailJS(answers) {
    if (typeof emailjs === 'undefined') {
      console.log('EmailJS not loaded, skipping email send');
      return;
    }
    
    const templateParams = {
      age: answers.age,
      gender: answers.gender,
      siblings: answers.siblings,
      favorite_color: answers.favColor,
      loves_baby_ben: answers.loveBen,
      favorite_character: answers.favCharacter || 'Not specified',
      from_name: 'Baby Ben Fan Page Visitor',
      timestamp: new Date().toLocaleString()
    };
    
    await emailjs.send(
      'service_dywgx5m',
      'template_ka6kjko',
      templateParams
    );
  }

  // Show character result with special styling
  showCharacterResult(message, character) {
    // Create result modal/popup
    let resultModal = document.getElementById('character-result-modal');
    if (!resultModal) {
      resultModal = document.createElement('div');
      resultModal.id = 'character-result-modal';
      resultModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.35s ease;
      `;
      document.body.appendChild(resultModal);
    }
    
    resultModal.innerHTML = `
      <div style="
        background: var(--color-accent2);
        padding: calc(var(--spacing-1) * 1.5);
        border-radius: var(--spacing-3);
        text-align: center;
        color: white;
        max-width: 53rem;
        margin: var(--spacing-1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      ">
        <h2 style="margin: 0 0 var(--spacing-2) 0; font-family: 'Orbitron', monospace; color: var(--color-accent1);">🎉 Result! 🎉</h2>
        <p style="font-size: calc(var(--p-size) * 1.37); line-height: 1.6; margin: 0 0 calc(var(--spacing-1) * 1.2) 0;">${message}</p>
        <button onclick="this.closest('#character-result-modal').style.opacity='0'; setTimeout(() => this.closest('#character-result-modal').remove(), 300)" 
                style="
                  background-color: var(--color-accent1);
                  color: white;
                  border: none;
                  padding: var(--spacing-5) var(--spacing-1);
                  border-radius: calc(var(--spacing-1) * 1.35);
                  font-size: var(--spacing-3);
                  cursor: pointer;
                  font-weight: bold;
                  transition: background-color 0.4s ease;
                "
                onmouseover="this.style.backgroundColor='var(--color-primary)'"
                onmouseout="this.style.backgroundColor='var(--color-accent1)'">
          Awesome! ✨
        </button>
      </div>
    `;
    
    // Show modal
    setTimeout(() => {
      resultModal.style.opacity = '1';
    }, 100);
  }

  // Setup share button functionality
  setupShareFunction() {
    // No additional setup needed for share function
    console.log('Share functionality ready');
  }

  // Enhanced event listeners with additional protection
  setupEventListeners() {
    // Like button event listener with throttling
    let likeClickTimeout = null;
    this.likeButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear any existing timeout
      if (likeClickTimeout) {
        clearTimeout(likeClickTimeout);
      }
      
      // Throttle clicks
      likeClickTimeout = setTimeout(() => {
        if (!this.likeButton.disabled) {
          this.handleLikeClick();
        }
      }, 100);
    });

    // Share button event listener with throttling
    let shareClickTimeout = null;
    this.shareButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear any existing timeout
      if (shareClickTimeout) {
        clearTimeout(shareClickTimeout);
      }
      
      // Throttle clicks
      shareClickTimeout = setTimeout(() => {
        if (!this.shareButton.disabled) {
          this.handleShareClick();
        }
      }, 100);
    });

    // Form submission event listener
    if (this.questionsForm) {
      this.questionsForm.addEventListener('submit', (e) => {
        const submitButton = this.questionsForm.querySelector('#questions-submit-btn');
        if (!submitButton.disabled) {
          this.handleFormSubmit(e);
        } else {
          e.preventDefault();
        }
      });
    }
  }

  // Show user feedback messages
  showFeedback(message, type = 'success') {
    // Create feedback element if it doesn't exist
    let feedback = document.getElementById('user-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'user-feedback';
      document.body.appendChild(feedback);
    }

    // Set styling based on type
    const bgColor = type === 'error' ? 'var(--color-accent1)' : 'var(--color-dark1)';
    
    feedback.style.cssText = `
      position: fixed;
      top: var(--spacing-1);
      right: var(--spacing-1);
      background: ${bgColor};
      color: white;
      padding: var(--spacing-4) var(--spacing-2);
      border-radius: var(--spacing-5);
      font-size: var(--spacing-3);
      z-index: 1000;
      transform: translateX(150%);
      transition: transform 0.37s ease;
      max-width: 30rem;
      word-wrap: break-word;
    `;

    // Show feedback message
    feedback.textContent = message;
    feedback.style.transform = 'translateX(0)';

    // Hide after 5 seconds for errors, 3 for success
    const hideDelay = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      feedback.style.transform = 'translateX(150%)';
    }, hideDelay);
  }
}

// Import onSnapshot for real-time updates
import { onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Global instance variable
window.fanPageInstance = null;

// Initialize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.fanPageInstance = new FanPageFunctionality();
  
  // Set up real-time listener after instance is created
  setTimeout(() => {
    if (window.fanPageInstance) {
      setupRealtimeListener();
    }
  }, 1000);
});

// Real-time like count updates function
function setupRealtimeListener() {
  onSnapshot(likesDocRef, (doc) => {
    if (doc.exists()) {
      const newCount = doc.data().count || 0;
      const fanPage = window.fanPageInstance;
      
      // Update count if instance exists and count has changed
      if (fanPage && newCount !== fanPage.currentLikes) {
        fanPage.currentLikes = newCount;
        fanPage.updateLikeButtonDisplay();
      }
    }
  }, (error) => {
    console.error('Error listening to like updates:', error);
  });
}