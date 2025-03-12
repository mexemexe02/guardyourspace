# Cursor Rules for Web Projects

This repository contains reusable CSS rules for cursor styling across different web projects. Consistent cursor behavior improves user experience by providing intuitive visual feedback about interactive elements.

## Quick Start

1. Add the CSS file to your project:
   ```html
   <link rel="stylesheet" href="path/to/cursor-rules.css">
   ```

2. Apply the included CSS classes to your HTML elements or use them as a reference for your own stylesheets.

## Benefits

- **Improved UX**: Users intuitively understand which elements are interactive
- **Consistency**: Maintain the same cursor behavior across all your projects
- **Accessibility**: Properly indicates element functionality for all users
- **Reduced Development Time**: Reuse these rules instead of redefining them for each project

## Usage Examples

### Basic Interactive Elements

```html
<!-- Regular Text (default cursor) -->
<p>This is regular text with the default cursor.</p>

<!-- Clickable Elements (pointer cursor) -->
<button>Click Me</button>
<a href="#">Link</a>
<div class="card clickable">Interactive Card</div>

<!-- Text Input (text cursor) -->
<input type="text" placeholder="Type here...">
<div contenteditable="true">Editable content</div>
```

### Functional States

```html
<!-- Loading State -->
<button class="loading">Processing...</button>

<!-- Disabled Elements -->
<button disabled>Cannot Click</button>
<div class="btn disabled">Unavailable Option</div>

<!-- Help Elements -->
<span title="More information about this feature" class="info-icon">?</span>
<abbr title="Cascading Style Sheets">CSS</abbr>
```

### Draggable Elements

```html
<!-- Draggable Item -->
<div draggable="true">Drag me</div>
<div class="draggable">Drag this card</div>

<!-- Drag Handle -->
<div class="drag-handle">⋮⋮</div>
```

### Resizing Elements

```html
<!-- Resizable Elements -->
<div class="resize-handle">↘</div>
<div class="resize-horizontal">◄►</div>
<div class="resize-vertical">▲▼</div>
```

### Text and Zoom Operations

```html
<!-- Zoom Controls -->
<button class="zoom-in">+</button>
<button class="zoom-out">-</button>

<!-- Text Selection -->
<p class="text-select-all">This text will be fully selected on click</p>
```

### Directional Indicators

```html
<!-- Navigation Controls -->
<button class="nav-prev">Previous</button>
<button class="nav-next">Next</button>

<!-- Movable Elements -->
<div class="move">Move me around</div>
```

## Custom Cursors

To use custom image cursors:

1. Uncomment the custom cursor examples in the CSS file
2. Replace 'path-to-cursor.png' with your cursor image path
3. Adjust the hotspot coordinates if needed

```css
.custom-cursor {
  cursor: url('cursors/my-custom-cursor.png'), auto;
}
```

## Integration with JavaScript

For dynamic cursor changes:

```javascript
// Change cursor during async operations
async function submitForm() {
  const button = document.getElementById('submit-button');
  button.classList.add('loading');  // Apply wait cursor
  
  try {
    await sendFormData();
  } finally {
    button.classList.remove('loading');  // Remove wait cursor
  }
}

// Toggle cursors based on state
function toggleDragMode(element, isDraggable) {
  if (isDraggable) {
    element.classList.add('draggable');
  } else {
    element.classList.remove('draggable');
  }
}
```

## Browser Support

These cursor styles work in all modern browsers. The CSS includes specific accommodations for:

- Mobile/touch devices (where cursor styles don't apply, but we adjust tap targets)
- Safari-specific improvements
- Fallbacks for older browsers

## Customization

Feel free to:

1. Add your own cursor classes based on project needs
2. Modify existing classes to match your design system
3. Use these rules as a starting point for more elaborate cursor effects

## License

MIT License - Feel free to use, modify and distribute as needed.

---

**Created by: [Your Name]**  
For questions or improvements, open an issue or pull request. 