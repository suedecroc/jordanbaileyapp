# CSS Optimization Verification Checklist

## Pre-Implementation Testing

### Visual Regression Tests
- [ ] Load jordanbaileyvoice.com in Chrome
- [ ] Load jordanbaileyvoice.com in Firefox
- [ ] Load jordanbaileyvoice.com in Safari
- [ ] Open DevTools and check for any CSS parsing errors
- [ ] Compare rendered pages side-by-side (before/after)

### Responsive Design Tests
- [ ] Mobile viewport (375px width)
  - [ ] Navigation displays correctly
  - [ ] Text remains readable
  - [ ] Images scale properly
  - [ ] Floating elements position correctly

- [ ] Tablet viewport (768px width)
  - [ ] All shadows applied correctly
  - [ ] Navigation reorganizes at breakpoint
  - [ ] Language rail responds

- [ ] Desktop viewport (1280px+)
  - [ ] Act spine appears on left
  - [ ] Three-column layout for Champion Select
  - [ ] Hover effects work

### Interactive Elements
- [ ] Button hover states work smoothly
- [ ] Focus states visible with outline
- [ ] Tab navigation works
- [ ] Audio player controls function
- [ ] Language selection updates page

### Animation Tests
- [ ] Navigation transitions smooth (140ms)
- [ ] Button presses feel responsive
- [ ] Floating utility stack slides in
- [ ] Act spine reveals text on hover
- [ ] Champion Select:
  - [ ] Particle drift animation runs
  - [ ] Ornament pulses smoothly
  - [ ] Hex rings rotate
  - [ ] Lock-in button pulses
  - [ ] Sheen effect sweeps across button
  - [ ] Tooltips fade in

### Typography
- [ ] All headings render correctly
- [ ] Body text reads clearly
- [ ] Font sizes scale with viewport
- [ ] Letter spacing looks correct
- [ ] Line heights are comfortable
- [ ] Cinzel font loads for Champion Select

### Colors & Gradients
- [ ] All color values match original
- [ ] Gradients appear smooth
- [ ] No banding in gradients
- [ ] Shadow colors correct
- [ ] Overlay effects visible

### Performance
- [ ] Page loads quickly
- [ ] No layout shift on load
- [ ] Animations run at 60fps
- [ ] No console warnings
- [ ] No console errors

---

## Post-Implementation Checklist

### Daily Pages
- [ ] Homepage loads completely
- [ ] About page displays correctly
- [ ] Services page layouts properly
- [ ] Contact form visible and functional
- [ ] Footer displays correctly

### Champion Select Page
- [ ] Background layers appear
- [ ] Center nameplate visible
- [ ] Abilities display in grid
- [ ] Lock-in button prominent
- [ ] Left/right panels on desktop

### Browser Developer Tools
- [ ] No 404 errors
- [ ] No failed resource loads
- [ ] No CSS parsing errors
- [ ] Network tab shows proper file sizes
- [ ] Console tab is clean

### Mobile Testing
- [ ] Touch targets are proper size
- [ ] No horizontal scroll
- [ ] Safe area insets respected (notch/home bar)
- [ ] Floating UI doesn't overlap content
- [ ] Readable without zooming

### Accessibility
- [ ] Focus outlines visible
- [ ] Color contrast acceptable
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (if applicable)

---

## Specific CSS Features Verification

### CSS Variables Working
- [ ] `--transition-default` affects button hovers
- [ ] `--radius-base` applied to buttons
- [ ] `--radius-full` creates circles
- [ ] `--z-floating` keeps utility stack on top
- [ ] Change one variable and see all instances update

### Consolidated Styles
- [ ] Panel backgrounds identical on similar classes
- [ ] Video frame overlays match
- [ ] Button rail variants look correct
- [ ] Tab active states highlight properly
- [ ] Audio controls respond to clicks

### Media Queries
- [ ] Mobile (≤768px): Layout changes apply
- [ ] Tablet (≤1024px): Cover stage veil adjusts
- [ ] Desktop (≥1280px): Act spine displays
- [ ] Hover states disabled on touch devices
- [ ] Reduced motion disables animations

---

## Comparative Testing (Original vs Optimized)

Use browser DevTools to compare:

```javascript
// Get computed styles and compare
const element = document.querySelector('.button-rail');
const styles = window.getComputedStyle(element);

// Check individual properties
console.log('Background:', styles.background);
console.log('Border:', styles.border);
console.log('Transition:', styles.transition);
```

### Properties to Verify Match
- [ ] `background-color` (all elements)
- [ ] `border-color` (all elements)
- [ ] `transition` values (all interactive elements)
- [ ] `border-radius` (all rounded elements)
- [ ] `box-shadow` (all shadowed elements)
- [ ] `opacity` (all semi-transparent elements)
- [ ] `z-index` (all positioned elements)

---

## Before Replacing Original

### Backup Steps
```bash
# Navigate to project directory
cd /Users/jordan/Library/Mobile\ Documents/com~apple~CloudDocs/JordanBaileyApp/

# Backup original
cp app/globals.css app/globals.css.backup.YYYYMMDD

# Keep for comparison
cp app/globals.css app/globals.css.original
```

### Comparison Tools
- [ ] Download [DiffMerge](https://www.sourcegear.com/diffmerge/) or similar
- [ ] Open original and optimized side-by-side
- [ ] Verify all values preserved
- [ ] Check for any unexpected changes

---

## Final Approval

### Code Review
- [ ] All selectors verified as existing
- [ ] All properties verified as original
- [ ] All values verified as unchanged
- [ ] Variables correctly reference design tokens
- [ ] No syntax errors in optimized file

### Visual Approval
- [ ] Screenshots match between versions
- [ ] Responsive layouts identical
- [ ] Animation timing identical
- [ ] Color accuracy identical
- [ ] No unexpected styling changes

### Performance Check
- [ ] Lighthouse scores same or better
- [ ] Core Web Vitals unchanged
- [ ] Page load time unchanged
- [ ] Rendering performance identical
- [ ] No new layout shifts

---

## Rollback Plan

If issues arise after deployment:

1. **Immediate Rollback**
   ```bash
   # Restore original
   cp app/globals.css.backup app/globals.css

   # Clear browser cache
   # Verify site loads correctly
   ```

2. **Document Issues**
   - Screenshot any visual differences
   - Note affected elements
   - Record browser/version
   - Check console errors

3. **Investigation**
   - Compare computed styles in DevTools
   - Check for conflicting CSS
   - Verify variable definitions
   - Review cached versions

4. **Re-deployment**
   - Fix identified issues
   - Test changes locally
   - Verify with team
   - Deploy updated version

---

## Sign-Off

- [ ] All tests passed
- [ ] No visual regressions detected
- [ ] Performance acceptable
- [ ] Ready for production
- [ ] Backup created
- [ ] Rollback plan documented

**Date Tested**: _______________
**Tested By**: _______________
**Approved By**: _______________

