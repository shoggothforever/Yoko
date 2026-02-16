# DESIGN SYSTEM - 设计系统

## Color Palette

### Primary Colors
- **Background:** #0a0a0a (near-black)
- **Accent Red:** #e94560 (阳子的主题色)
- **Accent Purple:** #533483 (素子/网络主题色)
- **Dark Blue:** #0f3460
- **Text:** #e0e0e0 (light gray)
- **Secondary Text:** #a0a0a0 (medium gray)

### Gradients
- **Header:** linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)
- **Hero:** linear-gradient(135deg, #16213e 0%, #0f3460 100%)
- **Buttons:** linear-gradient(135deg, #e94560 0%, #533483 100%)

## Typography

- **Font Family:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Line Height:** 1.6
- **Logo:** Bold, 2rem, red with subtle text shadow

## Components

### Cards
- **Background:** linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)
- **Border:** 2px solid #0f3460
- **Radius:** 12px
- **Hover:** Lift effect, border changes to red, glow effect

### Ghost Cards (Chatroom)
- **Gally Theme:** Red accents (#e94560), battle icon ⚔️
- **Motoko Theme:** Purple accents (#533483), network icon 🌐
- **Active State:** Highlighted border
- **Hover:** Shine effect (left-to-right gradient)

### Message Bubbles (Chatroom)
- **Gally:** Red left border, red-tinted background
- **Motoko:** Purple left border, purple-tinted background
- **Avatar:** Emoji icon (2rem)
- **Name:** Bold, theme-colored

## Layout

- **Max Width:** 1200px
- **Container Padding:** 0 20px
- **Sections:** 80px vertical padding
- **Grid:** Responsive grid (auto-fit, minmax 280-300px)

## Special Effects

- **Text Shadow:** Subtle shadow on logo
- **Box Shadow:** Glow effect on buttons/cards
- **Reading Progress:** Top progress bar
- **Modal:** Semi-transparent black background, centered content

## Responsive Design

- **Mobile:** Stacked layout, single column grid
- **Tablet/Desktop:** Multi-column grid

---

*For CSS implementation, see `yoko-blog/style.css` (load only when needed)*
