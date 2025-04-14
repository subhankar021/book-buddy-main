# BookBuddy - Book Exchange Platform

BookBuddy is a full-stack web application that connects book owners and seekers, allowing them to exchange, rent, or give away books.

## Features

- **User Authentication**: Sign up and login functionality with role-based access (book owner or seeker)
- **Book Listings**: Browse, search, and filter books by various criteria
- **Book Management**: Owners can add, edit, and remove their book listings
- **Messaging System**: Users can contact book owners about listings
- **Responsive Design**: Fully responsive for both mobile and desktop views

## Setup Instructions

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/subhankar021/book-buddy-main.git
   cd book-buddy
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/public`: Static assets like images

## What's Working

- ✅ User authentication (demo mode)
- ✅ Book browsing and filtering
- ✅ Book details view
- ✅ Adding new book listings
- ✅ Editing and removing book listings
- ✅ Messaging system (demo mode)
- ✅ Responsive design

## What's Not Working / Limitations

- ⚠️ Backend integration: This is a frontend demo with mock data
- ⚠️ Real authentication: Currently using localStorage for demo purposes
- ⚠️ Image upload: In a production environment, this would connect to a storage service
- ⚠️ Real-time messaging: Currently simulated

## Bonus Features 
- You can edit or remove the listed books
- Filter listings by Genre/Location
- Add Book cover (image upload optional)
  
## AI used

- Used Ai like ChatGpt
 
## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

## License

MIT
\`\`\`

Now, let's update the book data to use Indian locations:
