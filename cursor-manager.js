/**
 * CursorManager - A utility class for dynamically managing cursor styles
 * This can be used alongside the cursor-rules.css file
 */
class CursorManager {
    /**
     * Initialize the CursorManager
     * @param {Object} options - Configuration options
     * @param {string} options.defaultCursor - The default cursor style (default: 'default')
     * @param {boolean} options.globalMode - Whether to enable the global cursor mode (default: false)
     * @param {Element} options.scopeElement - Element to scope cursor changes to (default: document.body)
     */
    constructor(options = {}) {
        this.options = {
            defaultCursor: 'default',
            globalMode: false,
            scopeElement: document.body,
            ...options
        };
        
        this.cursorStack = [];
        this.originalCursor = null;
        this.activeElement = null;
        this.scopeElement = this.options.scopeElement;
        
        // Store original cursor
        if (this.options.globalMode) {
            this.originalCursor = this.scopeElement.style.cursor;
        }
        
        // Bind methods
        this.setCursor = this.setCursor.bind(this);
        this.resetCursor = this.resetCursor.bind(this);
        this.pushCursor = this.pushCursor.bind(this);
        this.popCursor = this.popCursor.bind(this);
        this.applyTemporaryCursor = this.applyTemporaryCursor.bind(this);
    }
    
    /**
     * Set cursor style for an element or globally
     * @param {string} cursorType - CSS cursor value
     * @param {Element} [element] - Target element (uses scopeElement if in globalMode)
     * @returns {CursorManager} - For method chaining
     */
    setCursor(cursorType, element = null) {
        if (this.options.globalMode || !element) {
            this.scopeElement.style.cursor = cursorType;
        } else {
            this.activeElement = element;
            element.style.cursor = cursorType;
        }
        return this;
    }
    
    /**
     * Reset cursor to default or original state
     * @param {Element} [element] - Target element
     * @returns {CursorManager} - For method chaining
     */
    resetCursor(element = null) {
        if (this.options.globalMode || !element) {
            this.scopeElement.style.cursor = this.originalCursor || this.options.defaultCursor;
        } else if (element) {
            element.style.cursor = '';
        } else if (this.activeElement) {
            this.activeElement.style.cursor = '';
            this.activeElement = null;
        }
        return this;
    }
    
    /**
     * Push cursor onto stack (useful for nested operations)
     * @param {string} cursorType - CSS cursor value
     * @param {Element} [element] - Target element
     * @returns {CursorManager} - For method chaining
     */
    pushCursor(cursorType, element = null) {
        const targetElement = element || this.scopeElement;
        this.cursorStack.push({
            element: targetElement,
            cursor: targetElement.style.cursor
        });
        return this.setCursor(cursorType, element);
    }
    
    /**
     * Pop cursor from stack
     * @returns {CursorManager} - For method chaining
     */
    popCursor() {
        if (this.cursorStack.length === 0) return this;
        
        const { element, cursor } = this.cursorStack.pop();
        element.style.cursor = cursor;
        return this;
    }
    
    /**
     * Apply a temporary cursor during an operation
     * @param {string} cursorType - CSS cursor value
     * @param {Promise|Function} operation - Promise or function to execute with temporary cursor
     * @param {Element} [element] - Target element
     * @returns {Promise} - Promise that resolves with operation result
     */
    async applyTemporaryCursor(cursorType, operation, element = null) {
        this.pushCursor(cursorType, element);
        
        try {
            const result = typeof operation === 'function' 
                ? await operation() 
                : await operation;
            return result;
        } finally {
            this.popCursor();
        }
    }
    
    /**
     * Setup cursor behavior for draggable elements
     * @param {Element|string} elementOrSelector - Element or CSS selector for draggable element
     * @param {Object} options - Draggable options
     * @returns {CursorManager} - For method chaining
     */
    setupDraggable(elementOrSelector, options = {}) {
        const elements = typeof elementOrSelector === 'string'
            ? document.querySelectorAll(elementOrSelector)
            : [elementOrSelector];
            
        const defaultOptions = {
            dragCursor: 'grabbing',
            hoverCursor: 'grab',
            dragClass: 'is-dragging',
            dragHandle: null
        };
        
        const config = { ...defaultOptions, ...options };
        
        elements.forEach(element => {
            if (!element) return;
            
            // If using a drag handle, apply hover cursor to handle
            const targetElement = config.dragHandle 
                ? element.querySelector(config.dragHandle) 
                : element;
                
            if (!targetElement) return;
            
            // Apply hover cursor
            targetElement.style.cursor = config.hoverCursor;
            
            // Setup mousedown/touchstart for drag cursor
            const startDrag = () => {
                element.classList.add(config.dragClass);
                this.setCursor(config.dragCursor, targetElement);
            };
            
            const endDrag = () => {
                element.classList.remove(config.dragClass);
                this.setCursor(config.hoverCursor, targetElement);
            };
            
            targetElement.addEventListener('mousedown', startDrag);
            targetElement.addEventListener('touchstart', startDrag);
            
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        });
        
        return this;
    }
    
    /**
     * Apply loading cursor during async operations
     * @param {Promise|Function} operation - Promise or function to execute with loading cursor
     * @param {Element} [element] - Target element (optional)
     * @returns {Promise} - Promise that resolves with operation result
     */
    async loading(operation, element = null) {
        return this.applyTemporaryCursor('wait', operation, element);
    }
    
    /**
     * Setup cursor state based on element state
     * @param {Element|string} elementOrSelector - Element or CSS selector
     * @param {Object} states - Map of states to cursor values
     * @returns {CursorManager} - For method chaining
     */
    setupStateCursors(elementOrSelector, states = {}) {
        const elements = typeof elementOrSelector === 'string'
            ? document.querySelectorAll(elementOrSelector)
            : [elementOrSelector];
            
        elements.forEach(element => {
            if (!element) return;
            
            // Define update function to check element state
            const updateCursor = () => {
                for (const [stateClass, cursor] of Object.entries(states)) {
                    if (element.classList.contains(stateClass)) {
                        element.style.cursor = cursor;
                        return;
                    }
                }
                
                // Reset if no states match
                element.style.cursor = states.default || '';
            };
            
            // Set initial cursor
            updateCursor();
            
            // Watch for class changes using MutationObserver
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class') {
                        updateCursor();
                    }
                }
            });
            
            observer.observe(element, { attributes: true });
        });
        
        return this;
    }
}

// Example usage:
/* 
const cursorManager = new CursorManager();

// For a loading button:
document.querySelector('#loading-button').addEventListener('click', async () => {
    const button = event.currentTarget;
    await cursorManager.loading(async () => {
        button.classList.add('loading');
        button.disabled = true;
        
        try {
            await someAsyncOperation();
        } finally {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }, button);
});

// For draggable elements:
cursorManager.setupDraggable('.draggable-item', {
    dragHandle: '.drag-handle'
});

// For elements with different states:
cursorManager.setupStateCursors('.multi-state-button', {
    'default': 'pointer',
    'disabled': 'not-allowed',
    'loading': 'wait',
    'edit-mode': 'text'
});
*/

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CursorManager;
} 