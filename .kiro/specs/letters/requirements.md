# Requirements Document

## Introduction

The Letters is a responsive web application that enables two partners to exchange letters in a visually appealing papyrus scroll interface. The application uses Supabase as the backend database with row-level security to ensure that only the letter author and recipient can access each letter. The app provides authentication, contact management, letter composition, and tracking of read/unread status.

## Glossary

- **Letters**: The web application system that manages Letters between users
- **User**: A person who has registered and authenticated with the Letters
- **Letter**: A digital message created by one User and sent to another User
- **Recipient**: The User designated to receive a specific Letter
- **Author**: The User who creates and sends a Letter
- **Contact**: A User that another User has added to their contact list for sending Letters
- **Unread Letter**: A Letter that the Recipient has not yet viewed
- **Read Letter**: A Letter that the Recipient has viewed at least once
- **Papyrus Scroll UI**: The visual interface component that displays a Letter with a papyrus scroll appearance
- **Supabase**: The backend database and authentication service
- **Row Level Security (RLS)**: Database security policy that restricts data access based on user identity
- **Login Timestamp**: The date and time when a User last authenticated with the Letters
- **Read Timestamp**: The date and time when a Recipient viewed a specific Letter

## Requirements

### Requirement 1

**User Story:** As a new user, I want to sign up for an account with email and password, so that I can start exchanging letters with my partner

#### Acceptance Criteria

1. THE Letters SHALL provide a signup interface that accepts email address and password
2. WHEN a User submits valid signup credentials, THE Letters SHALL create a new user account in Supabase
3. WHEN a User submits invalid signup credentials, THE Letters SHALL display an error message describing the validation failure
4. THE Letters SHALL enforce password strength requirements during signup
5. WHEN account creation succeeds, THE Letters SHALL authenticate the User and navigate to the home page

### Requirement 2

**User Story:** As a registered user, I want to log in with my email and password, so that I can access my letters

#### Acceptance Criteria

1. THE Letters SHALL provide a login interface that accepts email address and password
2. WHEN a User submits valid login credentials, THE Letters SHALL authenticate the User with Supabase
3. WHEN a User submits invalid login credentials, THE Letters SHALL display an error message
4. WHEN authentication succeeds, THE Letters SHALL record the current timestamp as the User's Login Timestamp
5. WHEN authentication succeeds, THE Letters SHALL navigate the User to the home page

### Requirement 3

**User Story:** As a user who forgot my password, I want to reset my password, so that I can regain access to my account

#### Acceptance Criteria

1. THE Letters SHALL provide a password reset interface accessible from the login page
2. WHEN a User submits their email address for password reset, THE Letters SHALL send a password reset email via Supabase
3. WHEN a User clicks the password reset link, THE Letters SHALL display a new password entry interface
4. WHEN a User submits a valid new password, THE Letters SHALL update the password in Supabase
5. WHEN password reset succeeds, THE Letters SHALL display a confirmation message

### Requirement 4

**User Story:** As a user, I want to see my unread letters stacked like papyrus paper with the oldest on top, so that I can read them in chronological order

#### Acceptance Criteria

1. WHEN a User navigates to the home page, THE Letters SHALL retrieve all Unread Letters for that User from Supabase
2. WHEN Unread Letters exist, THE Letters SHALL display them in a stacked visual layout with the oldest Letter on top
3. THE Letters SHALL display the count of Unread Letters at the top of the stack
4. WHEN a User has no Unread Letters, THE Letters SHALL retrieve all Read Letters for that User
5. WHEN displaying Read Letters, THE Letters SHALL order them with the most recent Letter on top

### Requirement 5

**User Story:** As a user viewing letters, I want to navigate between letters using arrow buttons or horizontal scrolling, so that I can easily browse through my correspondence

#### Acceptance Criteria

1. WHEN a User is viewing a Letter, THE Letters SHALL display a left arrow button and a right arrow button
2. WHEN a User clicks the right arrow button and a next Letter exists, THE Letters SHALL display the next Letter in the sequence
3. WHEN a User clicks the left arrow button and a previous Letter exists, THE Letters SHALL display the previous Letter in the sequence
4. WHEN no next Letter exists, THE Letters SHALL disable the right arrow button
5. WHEN no previous Letter exists, THE Letters SHALL disable the left arrow button
6. THE Letters SHALL support horizontal scrolling gestures to navigate between Letters
7. WHEN a User performs a horizontal scroll or swipe gesture to the left and a next Letter exists, THE Letters SHALL display the next Letter in the sequence
8. WHEN a User performs a horizontal scroll or swipe gesture to the right and a previous Letter exists, THE Letters SHALL display the previous Letter in the sequence
9. THE horizontal scrolling navigation SHALL work on both touch screen devices and desktop devices with trackpad or mouse wheel
10. THE horizontal scrolling SHALL trigger the same page-turning animation as the arrow button navigation

### Requirement 6

**User Story:** As a user, I want to view each letter in a papyrus scroll interface, so that the reading experience feels authentic and visually appealing

#### Acceptance Criteria

1. WHEN a User opens a Letter, THE Letters SHALL display the Letter content within a Papyrus Scroll UI component
2. THE Papyrus Scroll UI SHALL render with visual styling that resembles aged papyrus paper
3. THE Papyrus Scroll UI SHALL display the Letter content, author information, and timestamp
4. WHEN a Recipient views an Unread Letter, THE Letters SHALL update the Letter status to Read in Supabase
5. WHEN a Recipient views an Unread Letter, THE Letters SHALL record the Read Timestamp in Supabase

### Requirement 7

**User Story:** As a user with no letters, I want to see a tip to add a contact, so that I know how to start exchanging letters

#### Acceptance Criteria

1. WHEN a User has no Letters and no Contacts, THE Letters SHALL display a message prompting the User to add a Contact
2. THE Letters SHALL display an "Add Contact" button in the title bar
3. WHEN a User clicks the "Add Contact" button, THE Letters SHALL navigate to the add contact page
4. THE add contact prompt SHALL be visible when the User has no Unread Letters and no Read Letters
5. THE add contact prompt SHALL provide clear instructions on how to add a Contact

### Requirement 8

**User Story:** As a user, I want to add contacts by entering their user ID and a display name, so that I can send letters to them

#### Acceptance Criteria

1. THE Letters SHALL provide an add contact interface that accepts a user ID and an associated display name
2. WHEN a User submits a valid user ID and display name, THE Letters SHALL save the Contact association in Supabase
3. WHEN a User submits an invalid user ID, THE Letters SHALL display an error message
4. WHEN a Contact is successfully added, THE Letters SHALL navigate the User back to the home page
5. THE Letters SHALL validate that the user ID corresponds to an existing User in Supabase

### Requirement 9

**User Story:** As a user, I want to filter letters by contact and date range, so that I can find specific correspondence

#### Acceptance Criteria

1. THE Letters SHALL display filter controls on the home page for contacts and date ranges
2. THE contact filter SHALL support multi-select allowing the User to select multiple Contacts simultaneously
3. WHEN a User selects one or more Contacts from the filter, THE Letters SHALL display only Letters where a selected Contact is either the Author or Recipient
4. THE Letters SHALL provide a "letters before date" filter that accepts a date input
5. WHEN a User enters a date in the "letters before date" filter, THE Letters SHALL display only Letters created before the specified date
6. THE Letters SHALL provide a "letters after date" filter that accepts a date input
7. WHEN a User enters a date in the "letters after date" filter, THE Letters SHALL display only Letters created after the specified date
8. WHEN multiple filters are active, THE Letters SHALL display only Letters that satisfy all active filter criteria
9. WHEN a User clears all filters, THE Letters SHALL display all Letters for the User
10. THE filtered view SHALL maintain the same ordering rules as the unfiltered view

### Requirement 10

**User Story:** As a user, I want to compose a new letter with a papyrus scroll interface, so that I can send a message to my contact

#### Acceptance Criteria

1. THE Letters SHALL display a "Create New Letter" button in the title bar
2. WHEN a User clicks the "Create New Letter" button, THE Letters SHALL display an editable Papyrus Scroll UI
3. THE editable Papyrus Scroll UI SHALL allow the User to enter Letter content
4. THE Letters SHALL automatically populate the current date and time in the Letter
5. THE editable Papyrus Scroll UI SHALL provide a recipient selection control that lists the User's Contacts

### Requirement 11

**User Story:** As a user composing a letter, I want to send it to a recipient, so that they can read my message

#### Acceptance Criteria

1. WHEN a User is composing a Letter, THE Letters SHALL display a "Send" button
2. WHEN a User clicks the "Send" button with valid content and a selected Recipient, THE Letters SHALL save the Letter to Supabase
3. THE Letters SHALL set the Letter status to Unread when saving
4. WHEN the Letter is saved successfully, THE Letters SHALL navigate the User back to the home page
5. THE Letters SHALL apply Row Level Security policies ensuring only the Author and Recipient can access the Letter

### Requirement 12

**User Story:** As a user, I want to access my profile menu, so that I can log out or view my sent letters

#### Acceptance Criteria

1. THE Letters SHALL display a profile icon in the top right corner of the title bar
2. WHEN a User clicks the profile icon, THE Letters SHALL display a menu with "Logout" and "Sent" options
3. WHEN a User clicks "Logout", THE Letters SHALL terminate the User session and navigate to the login page
4. WHEN a User clicks "Sent", THE Letters SHALL navigate to the sent letters view
5. THE profile menu SHALL close when the User clicks outside the menu area

### Requirement 13

**User Story:** As a user, I want to view all letters I have sent with filtering options, so that I can track my correspondence

#### Acceptance Criteria

1. WHEN a User navigates to the sent letters view, THE Letters SHALL retrieve all Letters authored by the User from Supabase
2. THE Letters SHALL display sent Letters in a stacked layout with the most recent Letter on top
3. WHEN a Recipient has viewed a sent Letter, THE Letters SHALL display the Read Timestamp next to that Letter
4. WHEN a Recipient has not viewed a sent Letter, THE Letters SHALL display the Recipient's most recent Login Timestamp
5. THE sent letters view SHALL allow the User to open and view each sent Letter in the Papyrus Scroll UI
6. THE Letters SHALL display filter controls in the sent letters view for contacts and date ranges
7. THE contact filter SHALL support multi-select allowing the User to filter by multiple Recipients simultaneously
8. WHEN a User enters a date in the "letters before date" filter, THE Letters SHALL display only sent Letters created before the specified date
9. WHEN a User enters a date in the "letters after date" filter, THE Letters SHALL display only sent Letters created after the specified date
10. WHEN multiple filters are active, THE Letters SHALL display only sent Letters that satisfy all active filter criteria

### Requirement 14

**User Story:** As a user, I want to edit or delete sent letters that have not been seen by the recipient, so that I can correct mistakes before they are read

#### Acceptance Criteria

1. WHEN a User opens a sent Letter in the Papyrus Scroll UI and the Recipient has not viewed the Letter, THE Letters SHALL display an edit icon and a delete icon
2. WHEN a User opens a sent Letter that the Recipient has already viewed, THE Letters SHALL NOT display edit or delete icons
3. WHEN a User clicks the edit icon on an unseen sent Letter, THE Letters SHALL make the Papyrus Scroll UI editable
4. WHEN a User saves edits to an unseen sent Letter, THE Letters SHALL update the Letter content in Supabase
5. WHEN a User clicks the delete icon on an unseen sent Letter, THE Letters SHALL display a confirmation dialog
6. THE confirmation dialog SHALL ask the User to confirm the deletion action
7. WHEN a User confirms deletion, THE Letters SHALL delete the Letter from Supabase
8. WHEN a User cancels deletion, THE Letters SHALL close the confirmation dialog without deleting the Letter
9. WHEN a Letter is successfully deleted, THE Letters SHALL navigate the User back to the sent letters view

### Requirement 15

**User Story:** As a user, I want all UI elements styled with a papyrus theme and smooth page-turning animations, so that the entire experience feels authentic and immersive

#### Acceptance Criteria

1. THE Letters SHALL style all UI components including date pickers, buttons, and input fields with a papyrus aesthetic
2. THE date picker component SHALL use papyrus-themed styling with aged paper appearance and appropriate typography
3. THE filter controls SHALL use papyrus-themed styling consistent with the overall application design
4. WHEN a User clicks the next arrow button to navigate to another Letter, THE Letters SHALL animate the transition with a page-turning effect
5. WHEN a User clicks the previous arrow button to navigate to another Letter, THE Letters SHALL animate the transition with a page-turning effect in reverse
6. THE page-turning animation SHALL create the visual impression of turning physical papyrus pages
7. THE Letters SHALL apply papyrus-themed styling to all interactive elements including menus, dialogs, and confirmation prompts
8. THE papyrus theme SHALL use appropriate color palettes, textures, and typography that evoke aged paper and historical documents

### Requirement 16

**User Story:** As a user, I want the app to be responsive, so that I can use it on different devices

#### Acceptance Criteria

1. THE Letters SHALL render correctly on desktop screen sizes (1024px width and above)
2. THE Letters SHALL render correctly on tablet screen sizes (768px to 1023px width)
3. THE Letters SHALL render correctly on mobile screen sizes (below 768px width)
4. THE Papyrus Scroll UI SHALL adapt its layout to fit the available screen width
5. THE Letters SHALL maintain usability and readability across all supported screen sizes

### Requirement 17

**User Story:** As a system administrator, I want row-level security enforced on all letters, so that users can only access letters they are authorized to view

#### Acceptance Criteria

1. THE Letters SHALL configure Supabase Row Level Security policies on the Letters table
2. THE RLS policy SHALL allow a User to read a Letter only when the User is the Author or the Recipient
3. THE RLS policy SHALL allow a User to create a Letter only when the User is set as the Author
4. THE RLS policy SHALL allow a User to update a Letter when the User is the Recipient and only to update the read status and Read Timestamp
5. THE RLS policy SHALL allow a User to update a Letter when the User is the Author and the Letter has not been read by the Recipient
6. THE RLS policy SHALL allow a User to delete a Letter only when the User is the Author and the Letter has not been read by the Recipient
7. THE RLS policy SHALL deny all other access attempts to Letter data
