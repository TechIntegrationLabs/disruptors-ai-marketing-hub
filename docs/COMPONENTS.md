# Component Documentation

This document provides comprehensive documentation for all React components in the Disruptors AI Marketing Hub.

## Component Architecture

The application follows a structured component organization pattern:

```
src/components/
├── ui/              # Design system components (49 components)
├── shared/          # Reusable business components
├── home/            # Homepage-specific components
├── solutions/       # Solution page components
└── work/            # Case study and portfolio components
```

## Design System Components (`src/components/ui/`)

### Core Components

#### Button (`button.jsx`)
```jsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click me
</Button>
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

#### Input (`input.jsx`)
```jsx
import { Input } from '@/components/ui/input';

<Input
  type="email"
  placeholder="Enter your email"
  className="w-full"
/>
```

#### Card Components (`card.jsx`)
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Navigation Components

#### Navigation Menu (`navigation-menu.jsx`)
```jsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
```

#### Breadcrumb (`breadcrumb.jsx`)
```jsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
```

### Data Display Components

#### Table (`table.jsx`)
```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
```

#### Chart (`chart.jsx`)
Advanced charting components with Recharts integration for data visualization.

#### Carousel (`carousel.jsx`)
```jsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
```

### Dialog and Overlay Components

#### Dialog (`dialog.jsx`)
```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
```

#### Sheet (`sheet.jsx`)
Side panel component for mobile navigation and forms.

#### Popover (`popover.jsx`)
```jsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
```

### Form Components

#### Form (`form.jsx`)
React Hook Form integration with validation.

#### Select (`select.jsx`)
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

#### Checkbox (`checkbox.jsx`)
#### Radio Group (`radio-group.jsx`)
#### Switch (`switch.jsx`)
#### Slider (`slider.jsx`)

### Feedback Components

#### Alert (`alert.jsx`)
```jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

#### Toast (`toast.jsx`, `use-toast.jsx`)
```jsx
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

toast({
  title: "Success!",
  description: "Your action was completed successfully.",
});
```

#### Progress (`progress.jsx`)
#### Skeleton (`skeleton.jsx`)

## Shared Components (`src/components/shared/`)

### Layout Components

#### Hero (`Hero.jsx`)
Main hero section component for landing pages.

**Props:**
- `title`: Main heading text
- `subtitle`: Secondary text
- `backgroundImage`: Optional background image URL
- `ctaText`: Call-to-action button text
- `ctaLink`: Call-to-action button URL

#### TwoColumnLayout (`TwoColumnLayout.jsx`)
Responsive two-column layout wrapper.

**Props:**
- `leftContent`: JSX content for left column
- `rightContent`: JSX content for right column
- `reverseOnMobile`: Boolean to reverse column order on mobile

#### DualCTABlock (`DualCTABlock.jsx`)
Two-button call-to-action section.

**Props:**
- `primaryCTA`: Primary button configuration
- `secondaryCTA`: Secondary button configuration
- `heading`: Section heading
- `description`: Section description

### Interactive Components

#### TextScramble (`TextScramble.jsx`)
Animated text effect component with scrambling animation.

**Props:**
- `text`: Text to display with scramble effect
- `speed`: Animation speed (default: 50)
- `className`: Additional CSS classes

#### ServiceScroller (`ServiceScroller.jsx`)
Horizontal scrolling service cards component.

**Props:**
- `services`: Array of service objects
- `autoScroll`: Boolean for automatic scrolling
- `scrollSpeed`: Speed of automatic scrolling

#### ClientLogoMarquee (`ClientLogoMarquee.jsx`)
Infinite scrolling client logo display.

**Props:**
- `logos`: Array of logo objects with `src` and `alt`
- `speed`: Scrolling speed
- `direction`: Scroll direction ('left' or 'right')

### Content Components

#### ReviewsCarousel (`ReviewsCarousel.jsx`)
Customer review carousel with navigation.

**Props:**
- `reviews`: Array of review objects
- `autoplay`: Boolean for automatic advancement
- `showDots`: Boolean to show navigation dots

#### BlackBarStatement (`BlackBarStatement.jsx`)
Full-width statement banner component.

**Props:**
- `text`: Statement text
- `backgroundColor`: Background color (default: black)
- `textColor`: Text color (default: white)

### Media Components

#### ImageGenerator (`ImageGenerator.jsx`)
AI image generation interface component.

**Props:**
- `onImageGenerated`: Callback function when image is generated
- `apiKey`: API key for image generation service
- `defaultPrompt`: Default prompt text

#### AIMediaGenerator (`AIMediaGenerator.jsx`)
Enhanced media generation component with multiple AI services.

**Props:**
- `services`: Array of available AI services
- `onMediaGenerated`: Callback for generated media
- `allowedTypes`: Array of allowed media types

### Utility Components

#### LoadingScreen (`LoadingScreen.jsx`)
Full-screen loading indicator.

**Props:**
- `message`: Loading message text
- `showProgress`: Boolean to show progress indicator

#### Placeholder (`Placeholder.jsx`)
Generic placeholder component for missing content.

**Props:**
- `width`: Placeholder width
- `height`: Placeholder height
- `text`: Placeholder text

#### PlaceholderAnimation (`PlaceholderAnimation.jsx`)
Animated placeholder with shimmer effect.

## Homepage Components (`src/components/home/`)

### HeroNew (`HeroNew.jsx`)
Modern hero section with advanced animations and interactive elements.

**Features:**
- Framer Motion animations
- Interactive background elements
- Responsive design
- Call-to-action integration

### ThreePillars (`ThreePillars.jsx`)
Three-column feature showcase component.

**Props:**
- `pillars`: Array of pillar objects with title, description, icon
- `layout`: Layout variant ('horizontal', 'vertical')

### ReviewCarousel (`ReviewCarousel.jsx`)
Homepage-specific review carousel with custom styling.

## Work Components (`src/components/work/`)

### CaseStudyPageLayout (`CaseStudyPageLayout.jsx`)
Standard layout for case study pages.

**Props:**
- `client`: Client name
- `project`: Project title
- `industry`: Industry category
- `services`: Array of services provided
- `results`: Key results and metrics
- `testimonial`: Client testimonial
- `images`: Array of project images

## Component Development Guidelines

### 1. Component Structure
```jsx
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {Function} props.onClick - Click handler
 */
const MyComponent = ({ title, onClick, ...props }) => {
  return (
    <div className="component-wrapper" {...props}>
      <h2>{title}</h2>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

export default MyComponent;
```

### 2. Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic HTML elements
- Maintain consistent spacing scale

### 3. Accessibility Requirements
- Include proper ARIA labels
- Ensure keyboard navigation support
- Maintain sufficient color contrast
- Use semantic HTML structure

### 4. Props Documentation
- Document all props with JSDoc comments
- Include prop types and descriptions
- Provide usage examples
- Document default values

### 5. Performance Considerations
- Implement proper memo usage for expensive renders
- Use lazy loading for large components
- Optimize image assets
- Minimize re-renders with stable references

## Testing Guidelines

### Component Testing
```jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component with title', () => {
  render(<MyComponent title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### Accessibility Testing
```jsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Migration and Updates

### Component Updates
When updating components, ensure:
1. Backward compatibility with existing props
2. Updated documentation
3. Migration guide for breaking changes
4. Updated tests

### New Component Checklist
- [ ] JSDoc documentation
- [ ] Accessibility compliance
- [ ] Responsive design
- [ ] Test coverage
- [ ] Example usage
- [ ] Integration with design system

This documentation should be updated whenever components are added, modified, or removed from the codebase.