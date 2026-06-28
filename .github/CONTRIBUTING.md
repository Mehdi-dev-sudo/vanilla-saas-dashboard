# Contributing to SaaS Dashboard

We love your input! We want to make contributing as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`.
2. Make your changes.
3. Test your changes by opening `index.html` in your browser.
4. Submit a pull request.

## Project Structure

```
├── index.html          # Main HTML entry point
├── css/
│   └── main.css        # Complete design system
├── js/
│   ├── app.js          # Application entry point
│   ├── core/           # Core modules (router, utils)
│   ├── data/           # Data layer
│   ├── components/     # Reusable UI components
│   └── pages/          # Page-specific modules
└── .github/            # GitHub templates
```

## Code Style

- Use 2 spaces for indentation
- Follow BEM naming for CSS classes
- Use single quotes for strings
- Use camelCase for variable and function names
- Use PascalCase for constructor functions
- Add JSDoc comments for public APIs

## Commit Messages

Use conventional commit format:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code restructuring
- `style:` formatting changes
- `chore:` maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed.
2. Make sure your code works across Chrome, Firefox, and Safari.
3. Your PR will be reviewed by maintainers.
