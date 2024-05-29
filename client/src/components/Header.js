// Import the React library to create a functional component
import React from 'react';

// Define a functional component named Header
function Header() {
  // Render a header element with a title
  return (
    <header className="header">
      <h1>Task Manager</h1> {/* Display the title "Task Manager" within an h1 element */}
    </header>
  );
}

// Export the Header component to make it available for use in other parts of the application
export default Header;

/*
This React component, named Header, serves as the header section of the Task Manager application. It renders an <h1> element containing the title "Task Manager" within a <header> element. This component is designed to be reusable and can be imported and used in various parts of the application.
*/