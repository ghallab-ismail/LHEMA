[ ] Task 1: Inject SEO Meta Description

Target: index.html (specifically inside the <head> tags).

Action: * Locate the <head> section.

Inject the following HTML tag right below the <title> tag.

Note: I have drafted a description tailored to the initial launch, but feel free to adjust the text.

HTML

<meta name="description" content="Discover Maison Lhema. Explore our exclusive collection, featuring our signature high-quality white cashmere cape-style vest. Elegance and luxury redefined." />
[ ] Task 2: Generate Static robots.txt File

Target: The /public directory at the root of the project.

Action: * Create a new, plain text file named robots.txt directly inside the /public folder. (Placing it here ensures Vite copies it directly to the root of your build folder without processing it as HTML).

Inject the following standard allow-all plain text content into the file:

Plaintext

User-agent: *
Allow: /