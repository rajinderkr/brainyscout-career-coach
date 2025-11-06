# AI Pair Programming Guide: BrainyScout Lead Form

This guide helps AI coding agents quickly understand the essential architecture and patterns of the BrainyScout lead form application.

## Project Overview

This is a React/TypeScript application built using Vite that implements a multi-step career assessment and lead generation funnel. The app guides users through a series of questions about their job search, analyzes their responses, and offers personalized career guidance.

### Key Components & Data Flow

- `UserView.tsx`: Main component handling the multi-step wizard flow
  - Manages state using hooks for currentScreen, formData, and UI state
  - Renders different screens based on currentScreen value (questions, insights, analysis, offers)
  - Handles form submission and API integration with BrainyScout's backend

- Flow Architecture:
  1. Welcome screen → Question screens with insight screens between questions
  2. Analysis of responses → Generation of personalized plan
  3. Lead capture → Offer page → Payment/confirmation or decline path

### Important Patterns

1. **Question Screen Pattern**:
```typescript
interface QuestionScreen {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  options: Array<{
    icon: React.ElementType;
    title: string;
    subtitle: string;
    value: string;
  }>;
  multiSelect?: boolean;
  customLayout?: boolean;
}
```

2. **State Management**: Uses React hooks for local state:
```typescript
const [formData, setFormData] = useState<Record<string, any>>({});
const [currentScreen, setCurrentScreen] = useState(0);
```

3. **Lead Form Submission Pattern**:
```typescript
const leadData = {
    FirstName: formData.fullName.split(' ')[0],
    LastName: formData.fullName.split(' ').slice(1).join(' ') || '',
    Email: formData.email,
    Phone: formData.phone,
    IsSubscribe: formData.consent,
    LeadSourceId: 6,
    Status: 'New'
    // ... other fields
};
```

### Integration Points

1. **Lead API Endpoint**:
- POST to 'https://www.brainyscout.com/API/ReceiveLead'
- Content-Type: 'application/x-www-form-urlencoded'
- Handles success/failure with appropriate UI updates

2. **IP Geolocation**:
- Uses ipinfo.io for country detection
- Affects pricing display (INR vs USD) and currency symbols

### Styling Patterns

- Uses Tailwind CSS with custom color palette:
  - Primary: `#FF7A00` to `#FFB84D` gradient
  - Background: `#4314A0`, `#3D1A65`
  - Accent: `#A76EFF`
  - Text: `#E7D6FF` (light), `#FFB84D` (emphasis)

- Common component styles:
  - Buttons: `bg-gradient-to-r from-[#FF7A00] to-[#FFB84D]`
  - Cards: `bg-[#4314A0]/50 border border-[#A76EFF]/40`
  - Text inputs: `bg-[#3D0090] border-[#A76EFF]/40`

### Developer Workflows

1. **Adding New Questions**:
- Extend `getQuestionScreens()` array in `UserView.tsx`
- Follow existing question screen pattern
- Questions must have unique `id` and `key` properties

2. **Modifying the Analysis Logic**:
- Update `generateAnalysis()` function for new formData fields
- Adjust strength/blocking point/probability calculations

3. **Testing Changes**:
- Test through full funnel flow
- Verify lead submission with API
- Check responsive layouts
- Validate pricing/currency logic for different regions

### Tips for AI Development

1. When modifying screens, respect the following progression:
   - Question screens must have odd-numbered IDs
   - Insight screens must have even-numbered IDs
   - Maintain the screen ordering logic in navigation

2. When adding new form fields:
   - Update both formData state and leadData mapping
   - Add validation in handleContactSubmit
   - Update any analysis logic that uses the field

3. When styling:
   - Follow existing color scheme and gradient patterns
   - Use responsive classes (mobile-first)
   - Maintain consistent spacing/padding patterns

4. Error handling:
   - Always provide user feedback for API calls
   - Handle validation errors gracefully
   - Preserve user progress in form state

For any new features or changes, ensure they align with the conversion-optimized flow and maintain the professional, trustworthy UI/UX of the application.