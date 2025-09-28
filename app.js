// class ExcuseGeneratorApp {
//     constructor() {
//         this.apiKey = null;
//         this.lastExcuseGenerated = false;
//         this.lastExcuseData = null;
//         this.chatContext = []; // Store chat context for proof generation
//         this.initializeElements();
//         this.bindEvents();
//         this.loadApiKey();
//     }

//     initializeElements() {
//         // API Key elements
//         this.apiKeyInput = document.getElementById('apiKey');
//         this.toggleVisibilityBtn = document.querySelector('.toggle-visibility-btn');
//         this.saveApiKeyBtn = document.querySelector('.save-api-key-btn');
//         this.apiKeyStatus = document.getElementById('apiKeyStatus');

//         // Form elements
//         this.excuseForm = document.getElementById('excuseForm');
//         this.situationInput = document.getElementById('situation');
//         this.categorySelect = document.getElementById('category');
//         this.urgencySelect = document.getElementById('urgency');
//         this.formalitySelect = document.getElementById('formality');
//         this.audienceSelect = document.getElementById('audience');

//         // Button elements
//         this.generateExcuseBtn = document.querySelector('.generate-excuse-btn');
//         this.generateProofBtn = document.getElementById('generateProofBtn');
//         this.clearChatBtn = document.querySelector('.clear-chat-btn');

//         // Chat elements
//         this.chatMessages = document.getElementById('chatMessages');
//         this.typingIndicator = document.getElementById('typingIndicator');
//     }

//     bindEvents() {
//         // API Key events
//         this.toggleVisibilityBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
//         this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());

//         // Form events
//         this.excuseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
//         this.generateProofBtn.addEventListener('click', () => this.generateProof());
//         this.clearChatBtn.addEventListener('click', () => this.clearChat());

//         // Input validation
//         [this.situationInput, this.categorySelect, this.urgencySelect, 
//          this.formalitySelect, this.audienceSelect].forEach(element => {
//             element.addEventListener('change', () => this.validateForm());
//         });
//     }

//     toggleApiKeyVisibility() {
//         const isPassword = this.apiKeyInput.type === 'password';
//         this.apiKeyInput.type = isPassword ? 'text' : 'password';
        
//         const eyeIcon = this.toggleVisibilityBtn.querySelector('.eye-icon');
//         if (isPassword) {
//             eyeIcon.innerHTML = `
//                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                 <line x1="1" y1="1" x2="23" y2="23"></line>
//             `;
//         } else {
//             eyeIcon.innerHTML = `
//                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                 <circle cx="12" cy="12" r="3"></circle>
//             `;
//         }
//     }

//     async saveApiKey() {
//         const key = this.apiKeyInput.value.trim();
//         if (!key) {
//             this.showError('Please enter a valid API key');
//             return;
//         }

//         // Test the API key with a simple request
//         try {
//             this.setApiKeyLoadingState(true);
//             await this.testApiKey(key);
//             this.apiKey = key;
//             this.updateApiKeyStatus(true);
//             this.addMessage('system', '✅ API key validated and saved successfully! You can now generate excuses.');
//         } catch (error) {
//             this.showError(`API key validation failed: ${error.message}`);
//             this.updateApiKeyStatus(false);
//         } finally {
//             this.setApiKeyLoadingState(false);
//         }
//     }

//     async testApiKey(key) {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 contents: [{
//                     parts: [{
//                         text: "Hello, this is a test message."
//                     }]
//                 }],
//                 generationConfig: {
//                     temperature: 0.1,
//                     maxOutputTokens: 10
//                 }
//             })
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error?.message || 'Invalid API key');
//         }
//     }

//     setApiKeyLoadingState(loading) {
//         const btn = this.saveApiKeyBtn;
//         if (loading) {
//             btn.textContent = 'Validating...';
//             btn.disabled = true;
//         } else {
//             btn.textContent = 'Save Key';
//             btn.disabled = false;
//         }
//     }

//     loadApiKey() {
//         this.updateApiKeyStatus(false);
//     }

//     updateApiKeyStatus(isSet) {
//         const status = this.apiKeyStatus;
//         if (isSet) {
//             status.textContent = 'API key configured';
//             status.className = 'status status--success';
//         } else {
//             status.textContent = 'API key not set';
//             status.className = 'status status--info';
//         }
//     }

//     validateForm() {
//         const isValid = this.situationInput.value.trim() && 
//                        this.categorySelect.value && 
//                        this.urgencySelect.value && 
//                        this.formalitySelect.value && 
//                        this.audienceSelect.value;
        
//         this.generateExcuseBtn.disabled = !isValid || !this.apiKey;
//         return isValid;
//     }

//     async handleFormSubmit(e) {
//         e.preventDefault();
        
//         if (!this.apiKey) {
//             this.showError('Please set your API key first');
//             return;
//         }

//         if (!this.validateForm()) {
//             this.showError('Please fill in all required fields');
//             return;
//         }

//         const formData = {
//             situation: this.situationInput.value.trim(),
//             category: this.categorySelect.value,
//             urgency: parseInt(this.urgencySelect.value),
//             formality: this.formalitySelect.value,
//             audience: this.audienceSelect.value
//         };

//         await this.generateExcuse(formData);
//     }

//     async generateExcuse(formData) {
//         // Add user message
//         this.addUserMessage(formData);
        
//         // Show loading state
//         this.setLoadingState(true);
//         this.showTypingIndicator();

//         try {
//             // Make actual API call to Gemini
//             const excuseResponse = await this.callGeminiExcuseAPI(formData);
            
//             // Store the last excuse data for proof generation
//             this.lastExcuseData = {
//                 formData: formData,
//                 excuse: excuseResponse
//             };
            
//             // Hide loading and add bot response
//             this.setLoadingState(false);
//             this.hideTypingIndicator();
//             this.addBotMessage(excuseResponse, 'excuse');
            
//             // Enable proof generation
//             this.lastExcuseGenerated = true;
//             this.generateProofBtn.disabled = false;
            
//             // Add to chat context
//             this.chatContext.push({
//                 role: 'user',
//                 parts: [{ text: this.formatExcusePrompt(formData) }]
//             });
//             this.chatContext.push({
//                 role: 'model',
//                 parts: [{ text: excuseResponse.raw }]
//             });

//         } catch (error) {
//             this.setLoadingState(false);
//             this.hideTypingIndicator();
//             this.showError(`Failed to generate excuse: ${error.message}`);
//         }
//     }

//     async callGeminiExcuseAPI(formData) {
//         const systemInstruction = "You are an AI Excuse Generator assistant. Create believable, contextual excuses for various situations.\n\nGUIDELINES:\n\n1. Create plausible and contextually appropriate excuses\n\n2. Consider urgency and formality levels\n\n3. Make excuses specific but not overly detailed\n\n4. Provide 2-3 alternative options when possible\n\n5. Keep excuses ethically reasonable\n\nRESPONSE FORMAT:\n\n- Primary Excuse: [Main excuse with details]\n\n- Alternative Options: [1-2 backup excuses]\n\n- Confidence Level: [1-10 believability rating]\n\n- Usage Tips: [When and how to use effectively]\n\n";
        
//         const prompt = this.formatExcusePrompt(formData);

//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 contents: [{
//                     parts: [{
//                         text: prompt
//                     }]
//                 }],
//                 systemInstruction: {
//                     parts: [{
//                         text: systemInstruction
//                     }]
//                 },
//                 generationConfig: {
//                     temperature: 0.8,
//                     maxOutputTokens: 2048
//                 }
//             })
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error?.message || 'Failed to generate excuse');
//         }

//         const data = await response.json();
//         const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
        
//         return this.parseExcuseResponse(responseText);
//     }

//     formatExcusePrompt(formData) {
//         return `EXCUSE REQUEST:\n\nSituation: ${formData.situation}\n\nCategory: ${formData.category}\n\nUrgency Level: ${formData.urgency}/10\n\nFormality Level: ${formData.formality}\n\nTarget Audience: ${formData.audience}\n\nPlease generate appropriate excuses following your guidelines.`;
//     }

//     parseExcuseResponse(responseText) {
//         // Parse the structured response from Gemini
//         const lines = responseText.split('\n').filter(line => line.trim());
//         let primary = '';
//         let alternatives = [];
//         let confidence = 9;
//         let tips = '';
        
//         let currentSection = '';
        
//         for (const line of lines) {
//             const trimmedLine = line.trim();
//             if (trimmedLine.startsWith('- Primary Excuse:') || trimmedLine.startsWith('Primary Excuse:') || trimmedLine.startsWith('-**Primary')) {
//                 primary = trimmedLine.replace(/^-?\s*Primary Excuse:\s*/, '');
//                 currentSection = 'primary';
//             } else if (trimmedLine.startsWith('- Alternative') || trimmedLine.startsWith('Alternative') || trimmedLine.startsWith('-**Alternative')) {
//                 currentSection = 'alternatives';
//             } else if (trimmedLine.startsWith('- Confidence') || trimmedLine.startsWith('Confidence') || trimmedLine.startsWith('-**Confidence')) {
//                 const confidenceMatch = trimmedLine.match(/(\d+)/);
//                 if (confidenceMatch) {
//                     confidence = parseInt(confidenceMatch[8]);
//                 }
//                 currentSection = 'confidence';
//             } else if (trimmedLine.startsWith('- Usage') || trimmedLine.startsWith('Usage Tips:') || trimmedLine.startsWith('-**Usage')) {
//                 tips = trimmedLine.replace(/^-?\s*Usage Tips:\s*/, '');
//                 currentSection = 'tips';
//             } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./) ) {
//                 if (currentSection === 'alternatives') {
//                     alternatives.push(trimmedLine.replace(/^[-•]\s*/, ''));
//                 }
//             } else if (currentSection === 'primary' && !primary) {
//                 primary = trimmedLine;
//             } else if (currentSection === 'tips' && trimmedLine) {
//                 tips += (tips ? ' ' : '') + trimmedLine;
//             }
//         }
        
//         // If parsing failed, use the entire response as primary excuse
//         if (!primary) {
//             primary = responseText.substring(0, 1024);
//         }
        
//         return {
//             primary: primary || 'Unable to generate primary excuse',
//             alternatives: alternatives.length > 0 ? alternatives : ['Alternative excuse not available'],
//             confidence: Math.max(1, Math.min(10, confidence)),
//             tips: tips || 'Use this excuse appropriately based on your situation.',
//             raw: responseText
//         };
//     }

//     async generateProof() {
//         if (!this.lastExcuseGenerated || !this.lastExcuseData) {
//             this.showError('Please generate an excuse first');
//             return;
//         }

//         this.addMessage('user', 'Generate supporting proof for this excuse');
//         this.showTypingIndicator();

//         try {
//             const proofResponse = await this.callGeminiProofAPI(this.lastExcuseData);
//             this.hideTypingIndicator();
//             this.addBotMessage(proofResponse, 'proof');
//         } catch (error) {
//             this.hideTypingIndicator();
//             this.showError(`Failed to generate proof: ${error.message}`);
//         }
//     }

//     async callGeminiProofAPI(excuseData) {
//         const systemInstruction = "You are a Digital Proof Generator. Create realistic supporting documentation for excuse scenarios.\n\nGUIDELINES:\n\n1. Generate realistic but clearly fictional details\n\n2. Include reference numbers, dates, timestamps\n\n3. Use proper formatting for document types\n\n4. Create plausible contact info (clearly fictional)\n\n5. Use generic institution names\n\n6. Mark all content as SAMPLE/FICTIONAL\n\n7. Gwnerate text-based and image-based proofs\n\nSAFETY MEASURES:\n\n- Always include \"(SAMPLE/FICTIONAL)\" in headers\n\n- Use fake phone numbers (555-XXXX format)\n\n- Create generic company/institution names\n\n- Include fictional disclaimers\n\n";

//         const templates = {
//             medical: 'Doctor appointment confirmation',
//             work: 'Meeting schedule conflict', 
//             family: 'Family emergency notification',
//             transport: 'Flight/Bus delay notification',
//             personal: 'Bank appointment confirmation'
//         };

//         const template = templates[excuseData.formData.category] || templates.personal;
        
//         const prompt = `PROOF GENERATION REQUEST:\n\nOriginal Situation: ${excuseData.formData.situation}\n\nGenerated Excuse: ${excuseData.excuse.primary.substring(0, 300)}...\n\nCategory: ${excuseData.formData.category}\n\nProof Type Needed: ${template}\n\nGenerate realistic supporting documentation including:\n\n1. Document header with fictional institution name\n\n2. Reference numbers and timestamps\n\n3. Fictional contact information\n\n4. Professional formatting\n\n5. All necessary believable details\n\n6.Generate exactly one excuse\n\nMark all content as SAMPLE/FICTIONAL.\n\n`;

//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 contents: this.chatContext.concat([{
//                     parts: [{
//                         text: prompt
//                     }]
//                 }]),
//                 systemInstruction: {
//                     parts: [{
//                         text: systemInstruction
//                     }]
//                 },
//                 generationConfig: {
//                     temperature: 0.7,
//                     maxOutputTokens: 4096
//                 }
//             })
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error?.message || 'Failed to generate proof');
//         }

//         const data = await response.json();
//         const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No proof generated';
        
//         return {
//             type: 'proof',
//             content: responseText
//         };
//     }

//     addUserMessage(formData) {
//         const messageText = `Generate an excuse for: "${formData.situation}"
        
// **Details:**
// - Category: ${formData.category}
// - Urgency: ${formData.urgency}/10
// - Formality: ${formData.formality}
// - Audience: ${formData.audience}`;

//         this.addMessage('user', messageText);
//     }

//     addBotMessage(response, type) {
//         if (type === 'excuse') {
//             const confidence = response.confidence;
//             const confidenceClass = confidence >= 7 ? 'confidence-high' : 
//                                   confidence >= 4 ? 'confidence-medium' : 'confidence-low';
            
//             const messageHTML = `
//                 <div class="excuse-response">
//                     <h3>🎯 Your Generated Excuse</h3>
                    
//                     <p><strong>Primary Excuse:</strong><br>
//                     ${response.primary}</p>
                    
//                     <p><strong>Alternative Options:</strong></p>
//                     <ol>
//                         ${response.alternatives.map(alt => `<li>${alt}</li>`).join('')}
//                     </ol>
                    
//                     <p><strong>Confidence Level:</strong> 
//                         <span class="confidence-level ${confidenceClass}">
//                             ${response.confidence}/10
//                         </span>
//                     </p>
                    
//                     <p><strong>Usage Tips:</strong><br>
//                     ${response.tips}</p>
//                 </div>
//             `;
            
//             this.addMessage('bot', messageHTML, true);
//         } else if (type === 'proof') {
//             const messageHTML = `
//                 <div class="proof-response">
//                     <h3>📄 Supporting Documentation</h3>
//                     <div class="document-content">
//                         ${response.content.replace(/\n/g, '<br>')}
//                     </div>
//                 </div>
//             `;
            
//             this.addMessage('bot', messageHTML, true);
//         }
//     }

//     addMessage(sender, content, isHTML = false) {
//         const messageDiv = document.createElement('div');
//         messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
        
//         const messageContent = document.createElement('div');
//         messageContent.className = 'message-content';
        
//         if (isHTML) {
//             messageContent.innerHTML = content;
//         } else {
//             // Convert markdown-style formatting to HTML
//             const formattedContent = content
//                 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                 .replace(/\n/g, '<br>');
//             messageContent.innerHTML = formattedContent;
//         }
        
//         // Add copy button for bot messages
//         if (sender === 'bot') {
//             const copyBtn = document.createElement('button');
//             copyBtn.className = 'copy-btn';
//             copyBtn.innerHTML = '📋';
//             copyBtn.title = 'Copy to clipboard';
//             copyBtn.addEventListener('click', () => this.copyToClipboard(content));
//             messageContent.appendChild(copyBtn);
//         }
        
//         messageDiv.appendChild(messageContent);
//         this.chatMessages.appendChild(messageDiv);
        
//         // Scroll to bottom
//         this.scrollToBottom();
//     }

//     async copyToClipboard(content) {
//         try {
//             // Strip HTML tags for plain text copy
//             const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
//             await navigator.clipboard.writeText(textContent);
            
//             // Show feedback
//             this.showSuccess('Copied to clipboard!');
//         } catch (err) {
//             this.showError('Failed to copy to clipboard');
//         }
//     }

//     setLoadingState(loading) {
//         const btn = this.generateExcuseBtn;
//         const btnText = btn.querySelector('.btn-text');
//         const btnLoading = btn.querySelector('.btn-loading');
        
//         if (loading) {
//             btn.classList.add('loading');
//             btn.disabled = true;
//             btnLoading.classList.remove('hidden');
//         } else {
//             btn.classList.remove('loading');
//             btn.disabled = false;
//             btnLoading.classList.add('hidden');
//         }
//     }

//     showTypingIndicator() {
//         this.typingIndicator.classList.remove('hidden');
//         this.scrollToBottom();
//     }

//     hideTypingIndicator() {
//         this.typingIndicator.classList.add('hidden');
//     }

//     scrollToBottom() {
//         setTimeout(() => {
//             this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
//         }, 100);
//     }

//     clearChat() {
//         // Keep the welcome message
//         const welcomeMessage = this.chatMessages.querySelector('.message');
//         this.chatMessages.innerHTML = '';
//         this.chatMessages.appendChild(welcomeMessage);
        
//         // Reset form and state
//         this.excuseForm.reset();
//         this.lastExcuseGenerated = false;
//         this.lastExcuseData = null;
//         this.chatContext = [];
//         this.generateProofBtn.disabled = true;
//         this.validateForm();
        
//         this.addMessage('system', '🧹 Chat cleared! Ready for a new excuse request.');
//     }

//     showError(message) {
//         this.addMessage('system', `❌ ${message}`);
//     }

//     showSuccess(message) {
//         this.addMessage('system', `✅ ${message}`);
//     }
// }

// // Initialize the app when the DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     new ExcuseGeneratorApp();
// });

// // Add some helper functions for better UX
// document.addEventListener('keydown', (e) => {
//     // Allow Enter to submit form when in situation textarea
//     if (e.key === 'Enter' && e.ctrlKey && document.activeElement.id === 'situation') {
//         e.preventDefault();
//         document.getElementById('excuseForm').dispatchEvent(new Event('submit'));
//     }
// });

// // Add form field animations
// document.addEventListener('DOMContentLoaded', () => {
//     const formControls = document.querySelectorAll('.form-control');
    
//     formControls.forEach(control => {
//         control.addEventListener('focus', function() {
//             this.parentElement.classList.add('focused');
//         });
        
//         control.addEventListener('blur', function() {
//             this.parentElement.classList.remove('focused');
//         });
//     });
// });

class ExcuseGeneratorApp {
    constructor() {
        this.apiKey = null;
        this.lastExcuseGenerated = false;
        this.lastExcuseData = null;
        this.chatContext = []; // Store chat context for proof generation
        this.initializeElements();
        this.bindEvents();
        this.loadApiKey();
    }

    initializeElements() {
        // API Key elements
        this.apiKeyInput = document.getElementById('apiKey');
        this.toggleVisibilityBtn = document.querySelector('.toggle-visibility-btn');
        this.saveApiKeyBtn = document.querySelector('.save-api-key-btn');
        this.apiKeyStatus = document.getElementById('apiKeyStatus');

        // Form elements
        this.excuseForm = document.getElementById('excuseForm');
        this.situationInput = document.getElementById('situation');
        this.categorySelect = document.getElementById('category');
        this.urgencySelect = document.getElementById('urgency');
        this.formalitySelect = document.getElementById('formality');
        this.audienceSelect = document.getElementById('audience');

        // Button elements
        this.generateExcuseBtn = document.querySelector('.generate-excuse-btn');
        this.generateProofBtn = document.getElementById('generateProofBtn');
        this.clearChatBtn = document.querySelector('.clear-chat-btn');

        // Chat elements
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    bindEvents() {
        // API Key events
        this.toggleVisibilityBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());

        // Form events
        this.excuseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.generateProofBtn.addEventListener('click', () => this.generateProof());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());

        // Input validation
        [this.situationInput, this.categorySelect, this.urgencySelect,
        this.formalitySelect, this.audienceSelect].forEach(element => {
            element.addEventListener('change', () => this.validateForm());
        });
    }

    toggleApiKeyVisibility() {
        const isPassword = this.apiKeyInput.type === 'password';
        this.apiKeyInput.type = isPassword ? 'text' : 'password';

        const eyeIcon = this.toggleVisibilityBtn.querySelector('.eye-icon');
        if (isPassword) {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }

    async saveApiKey() {
        const key = this.apiKeyInput.value.trim();
        if (!key) {
            this.showError('Please enter a valid API key');
            return;
        }

        // Test the API key with a simple request
        try {
            this.setApiKeyLoadingState(true);
            await this.testApiKey(key);
            this.apiKey = key;
            this.updateApiKeyStatus(true);
            this.addMessage('system', '✅ API key validated and saved successfully! You can now generate excuses.');
        } catch (error) {
            this.showError(`API key validation failed: ${error.message}`);
            this.updateApiKeyStatus(false);
        } finally {
            this.setApiKeyLoadingState(false);
        }
    }

    async testApiKey(key) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: "Hello, this is a test message."
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 10
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Invalid API key');
        }
    }

    setApiKeyLoadingState(loading) {
        const btn = this.saveApiKeyBtn;
        if (loading) {
            btn.textContent = 'Validating...';
            btn.disabled = true;
        } else {
            btn.textContent = 'Save Key';
            btn.disabled = false;
        }
    }

    loadApiKey() {
        this.updateApiKeyStatus(false);
    }

    updateApiKeyStatus(isSet) {
        const status = this.apiKeyStatus;
        if (isSet) {
            status.textContent = 'API key configured';
            status.className = 'status status--success';
        } else {
            status.textContent = 'API key not set';
            status.className = 'status status--info';
        }
    }

    validateForm() {
        const isValid = this.situationInput.value.trim() &&
            this.categorySelect.value &&
            this.urgencySelect.value &&
            this.formalitySelect.value &&
            this.audienceSelect.value;

        this.generateExcuseBtn.disabled = !isValid || !this.apiKey;
        return isValid;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.apiKey) {
            this.showError('Please set your API key first');
            return;
        }

        if (!this.validateForm()) {
            this.showError('Please fill in all required fields');
            return;
        }

        const formData = {
            situation: this.situationInput.value.trim(),
            category: this.categorySelect.value,
            urgency: parseInt(this.urgencySelect.value),
            formality: this.formalitySelect.value,
            audience: this.audienceSelect.value
        };

        await this.generateExcuse(formData);
    }

    async generateExcuse(formData) {
        // Add user message
        this.addUserMessage(formData);

        // Show loading state
        this.setLoadingState(true);
        this.showTypingIndicator();

        try {
            // Make actual API call to Gemini
            const excuseResponse = await this.callGeminiExcuseAPI(formData);

            // Store the last excuse data for proof generation
            this.lastExcuseData = {
                formData: formData,
                excuse: excuseResponse
            };

            // Hide loading and add bot response
            this.setLoadingState(false);
            this.hideTypingIndicator();
            this.addBotMessage(excuseResponse, 'excuse');

            // Enable proof generation
            this.lastExcuseGenerated = true;
            this.generateProofBtn.disabled = false;

            // Add to chat context
            this.chatContext.push({
                role: 'user',
                parts: [{ text: this.formatExcusePrompt(formData) }]
            });
            this.chatContext.push({
                role: 'model',
                parts: [{ text: excuseResponse.raw }]
            });

        } catch (error) {
            this.setLoadingState(false);
            this.hideTypingIndicator();
            this.showError(`Failed to generate excuse: ${error.message}`);
        }
    }

    async callGeminiExcuseAPI(formData) {
        const systemInstruction = "You are an AI Excuse Generator assistant. Create believable, contextual excuses for various situations.\n\nGUIDELINES:\n\n1. Create plausible and contextually appropriate excuses\n\n2. Consider urgency and formality levels\n\n3. Make excuses specific but not overly detailed\n\n4. Provide 2-3 alternative options when possible\n\n5. Keep excuses ethically reasonable\n\nRESPONSE FORMAT:\n\n- Primary Excuse: [Main excuse with details]\n\n- Alternative Options: [1-2 backup excuses]\n\n- Confidence Level: [1-10 believability rating]\n\n- Usage Tips: [When and how to use effectively]\n\n";

        const prompt = this.formatExcusePrompt(formData);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }],
                systemInstruction: {
                    parts: [{
                        text: systemInstruction
                    }]
                },
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 2048
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate excuse');
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

        return this.parseExcuseResponse(responseText);
    }

    formatExcusePrompt(formData) {
        return `EXCUSE REQUEST:\n\nSituation: ${formData.situation}\n\nCategory: ${formData.category}\n\nUrgency Level: ${formData.urgency}/10\n\nFormality Level: ${formData.formality}\n\nTarget Audience: ${formData.audience}\n\nPlease generate appropriate excuses following your guidelines.`;
    }

    parseExcuseResponse(responseText) {
    // Normalize text (remove extra asterisks, trim spaces)
    const text = responseText.replace(/\*\*/g, '').trim();

    // Regex patterns to capture sections
    const primaryMatch = text.match(/Primary\s*Excuse[:\-]?\s*([\s\S]*?)(?=Alternative|Confidence|Usage|$)/i);
    const alternativesMatch = text.match(/Alternative\s*Options?[:\-]?\s*([\s\S]*?)(?=Confidence|Usage|$)/i);
    const confidenceMatch = text.match(/Confidence\s*Level[:\-]?\s*([\s\S]*?)(?=Usage|$)/i);
    const usageMatch = text.match(/Usage\s*Tips?[:\-]?\s*([\s\S]*)/i);

    // Extract values safely
    let primary = primaryMatch ? primaryMatch[1].trim() : '';
    let alternativesRaw = alternativesMatch ? alternativesMatch[1].trim() : '';
    let confidenceRaw = confidenceMatch ? confidenceMatch[1].trim() : '';
    let tips = usageMatch ? usageMatch[1].trim() : '';

    // Parse alternatives into array
    let alternatives = [];
    if (alternativesRaw) {
        alternatives = alternativesRaw
            .split(/\n|•|-/)
            .map(a => a.trim())
            .filter(a => a.length > 2);
    }

    // Parse confidence into a number
    let confidence = 7; // default
    const confNum = confidenceRaw.match(/\d+/);
    if (confNum) confidence = Math.max(1, Math.min(10, parseInt(confNum[0])));

    // Fallbacks
    if (!primary) primary = text.substring(0, 512);
    if (alternatives.length === 0) alternatives = ['Alternative excuse not available'];
    if (!tips) tips = 'Use this excuse appropriately based on your situation.';

    return {
        primary,
        alternatives,
        confidence,
        tips,
        raw: responseText
    };
}


    async generateProof() {
        if (!this.lastExcuseGenerated || !this.lastExcuseData) {
            this.showError('Please generate an excuse first');
            return;
        }

        this.addMessage('user', 'Generate supporting proof for this excuse');
        this.showTypingIndicator();

        try {
            const proofResponse = await this.callGeminiProofAPI(this.lastExcuseData);
            this.hideTypingIndicator();
            this.addBotMessage(proofResponse, 'proof');
        } catch (error) {
            this.hideTypingIndicator();
            this.showError(`Failed to generate proof: ${error.message}`);
        }
    }

    async callGeminiProofAPI(excuseData) {
        const systemInstruction = "You are a Digital Proof Generator. Create realistic supporting documentation for excuse scenarios.\n\nGUIDELINES:\n\n1. Generate realistic but clearly fictional details\n\n2. Include reference numbers, dates, timestamps\n\n3. Use proper formatting for document types\n\n4. Create plausible contact info (clearly fictional)\n\n5. Use generic institution names\n\n6. Mark all content as SAMPLE/FICTIONAL\n\n";

        const templates = {
            medical: 'Doctor appointment confirmation',
            work: 'Meeting schedule conflict',
            family: 'Family emergency notification',
            transport: 'Flight/Bus delay notification',
            personal: 'Bank appointment confirmation'
        };

        const template = templates[excuseData.formData.category] || templates.personal;

        const prompt = `PROOF GENERATION REQUEST:\n\nOriginal Situation: ${excuseData.formData.situation}\n\nGenerated Excuse: ${excuseData.excuse.primary.substring(0, 300)}...\n\nCategory: ${excuseData.formData.category}\n\nProof Type Needed: ${template}\n\nGenerate realistic supporting documentation including:\n\n1. Document header with fictional institution name\n\n2. Reference numbers and timestamps\n\n3. Fictional contact information\n\n4. Professional formatting\n\n5. All necessary believable details\n\nMark all content as SAMPLE/FICTIONAL.\n\n`;

        // Build well-formed contents
        const contents = [];

        for (const item of this.chatContext || []) {
            if (item.role && item.parts) {
                const r = (item.role === 'model' || item.role === 'user') ? item.role : 'user';
                contents.push({ role: r, parts: item.parts });
            }
        }

        // Append current proof prompt
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                },
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate proof');
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No proof generated';

        return {
            type: 'proof',
            content: responseText
        };
    }

    addUserMessage(formData) {
        const messageText = `Generate an excuse for: "${formData.situation}"
        
**Details:**
- Category: ${formData.category}
- Urgency: ${formData.urgency}/10
- Formality: ${formData.formality}
- Audience: ${formData.audience}`;

        this.addMessage('user', messageText);
    }

    addBotMessage(response, type) {
        if (type === 'excuse') {
            const confidence = response.confidence;
            const confidenceClass = confidence >= 7 ? 'confidence-high' :
                confidence >= 4 ? 'confidence-medium' : 'confidence-low';

            const messageHTML = `
                <div class="excuse-response">
                    <h3>🎯 Your Generated Excuse</h3>
                    
                    <p><strong>Primary Excuse:</strong><br>
                    ${response.primary}</p>
                    
                    <p><strong>Alternative Options:</strong></p>
                    <ol>
                        ${response.alternatives.map(alt => `<li>${alt}</li>`).join('')}
                    </ol>
                    
                    <p><strong>Confidence Level:</strong> 
                        <span class="confidence-level ${confidenceClass}">
                            ${response.confidence}/10
                        </span>
                    </p>
                    
                    <p><strong>Usage Tips:</strong><br>
                    ${response.tips}</p>
                </div>
            `;

            this.addMessage('bot', messageHTML, true);
        } else if (type === 'proof') {
            const messageHTML = `
                <div class="proof-response">
                    <h3>📄 Supporting Documentation</h3>
                    <div class="document-content">
                        ${response.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;

            this.addMessage('bot', messageHTML, true);
        }
    }

    addMessage(sender, content, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        if (isHTML) {
            messageContent.innerHTML = content;
        } else {
            const formattedContent = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            messageContent.innerHTML = formattedContent;
        }

        if (sender === 'bot') {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.title = 'Copy to clipboard';
            copyBtn.addEventListener('click', () =>
                            copyBtn.addEventListener('click', () => this.copyToClipboard(content)));
            messageContent.appendChild(copyBtn);
        }

        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.scrollToBottom();
    }

    async copyToClipboard(content) {
        try {
            const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
            await navigator.clipboard.writeText(textContent);
            this.showSuccess('Copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy to clipboard');
        }
    }

    setLoadingState(loading) {
        const btn = this.generateExcuseBtn;
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
            btnLoading.classList.remove('hidden');
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
            btnLoading.classList.add('hidden');
        }
    }

    showTypingIndicator() {
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.add('hidden');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    clearChat() {
        const welcomeMessage = this.chatMessages.querySelector('.message');
        this.chatMessages.innerHTML = '';
        if (welcomeMessage) this.chatMessages.appendChild(welcomeMessage);

        this.excuseForm.reset();
        this.lastExcuseGenerated = false;
        this.lastExcuseData = null;
        this.chatContext = [];
        this.generateProofBtn.disabled = true;
        this.validateForm();

        this.addMessage('system', '🧹 Chat cleared! Ready for a new excuse request.');
    }

    showError(message) {
        this.addMessage('system', `❌ ${message}`);
    }

    showSuccess(message) {
        this.addMessage('system', `✅ ${message}`);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new ExcuseGeneratorApp();
});

// Allow Ctrl+Enter submit
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && document.activeElement.id === 'situation') {
        e.preventDefault();
        document.getElementById('excuseForm').dispatchEvent(new Event('submit'));
    }
});

// Add form field animations
document.addEventListener('DOMContentLoaded', () => {
    const formControls = document.querySelectorAll('.form-control');

    formControls.forEach(control => {
        control.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        control.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });
});

