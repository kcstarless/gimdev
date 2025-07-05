# Gimdev 📝

A modern, full-stack personal web development blogging platform built with Ruby on Rails and cutting-edge frontend technologies. Gimdev provides a comprehensive content management system with rich text editing, interactive keyword visualization, and seamless user authentication.

## 🚀 Features

### ✍️ **Content Management**
- **Rich Text Editor**: Powered by Action Text and Trix for comprehensive content creation
- **Post Sections**: Dynamic nested sections with image attachments
- **Cover Images**: Upload and manage post cover images with preview
- **Draft & Publish**: Save drafts and publish when ready
- **Post Views Tracking**: Monitor post engagement and popularity

### 🏷️ **Smart Keyword System**
- **Interactive Keyword Tagging**: Add and manage keywords with autocomplete suggestions
- **3D Keyword Visualization**: Three.js powered spherical keyword cloud with interactive navigation
- **Keyword Frequency**: Visual representation of keyword popularity and usage
- **Search by Keywords**: Browse posts filtered by specific keywords
- **Real-time Suggestions**: Dynamic keyword suggestions while typing

### 🔐 **Authentication & User Management**
- **Secure Authentication**: Session-based authentication with CSRF protection
- **Guest Login**: Temporary access for content creation without registration
- **User Dashboard**: Manage posts and view analytics
- **Rate Limiting**: Protection against brute force attacks

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first design with SCSS grid layouts
- **Interactive Animations**: Smooth transitions and hover effects
- **Breadcrumb Navigation**: Clear navigation hierarchy
- **Dark Theme**: Professional dark color scheme
- **Custom Typography**: Multiple Google Fonts integration (Poppins, Paytone One, Righteous)

### 📱 **Progressive Web App (PWA)**
- **Offline Capability**: Service worker for offline content access
- **Push Notifications**: Web push notification support
- **App Installation**: Installable on mobile and desktop devices
- **Mobile Optimized**: Touch-friendly interface with mobile gestures

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Ruby on Rails 8.0.1
- **Database**: PostgreSQL with multiple connection support
- **Authentication**: Custom authentication concern with session management
- **Background Jobs**: Solid Queue for job processing
- **Caching**: Solid Cache Store for performance optimization
- **File Storage**: Active Storage with Tigris for production
- **Email**: Action Mailer for notifications

### **Frontend**
- **JavaScript**: Stimulus controllers for interactive components
- **CSS**: SCSS with custom design system and mixins
- **3D Graphics**: Three.js for interactive keyword visualization
- **Rich Text**: Trix editor with Action Text integration
- **HTTP Client**: Axios for API communication
- **Build Tools**: esbuild for JavaScript bundling, Sass for CSS compilation

### **Interactive Components**
- **3D Keyword Cloud**: TrackballControls for spherical keyword navigation
- **Image Preview**: Real-time image upload preview
- **Form Enhancements**: Rails Nested Form with Stimulus integration
- **Loading Indicators**: Custom loading bars and progress indicators
- **Responsive Navigation**: Hamburger menu for mobile devices

### **Development & Deployment**
- **Testing**: RSpec for comprehensive testing suite
- **Code Quality**: Rubocop Rails Omakase for consistent code style
- **Security**: Brakeman for vulnerability scanning
- **Deployment**: Fly.io with Docker containerization
- **Alternative Deployment**: Kamal for production deployment
- **Environment**: Ruby 3.2.2, Node.js 20.11.0

## 🏗️ Architecture

```
gimdev/
├── app/
│   ├── controllers/           # Rails controllers
│   │   ├── concerns/         # Shared controller logic
│   │   │   └── authentication.rb    # Authentication module
│   │   ├── posts_controller.rb      # Blog post management
│   │   ├── keywords_controller.rb   # Keyword API endpoints
│   │   └── sessions_controller.rb   # User authentication
│   ├── models/               # Data models
│   │   ├── post.rb          # Blog post model with rich text
│   │   ├── keyword.rb       # Keyword tagging system
│   │   ├── section.rb       # Post sections with attachments
│   │   └── user.rb          # User authentication model
│   ├── views/               # ERB templates
│   │   ├── layouts/         # Application layouts
│   │   ├── posts/           # Post display templates
│   │   └── sessions/        # Authentication forms
│   ├── javascript/          # Stimulus controllers
│   │   └── controllers/     # Interactive components
│   │       ├── 2d.ts               # 3D keyword visualization
│   │       ├── keywords_controller.js    # Keyword management
│   │       ├── image_preview_controller.js  # Image upload preview
│   │       └── threejs_controller.js     # Three.js integration
│   └── assets/              # Stylesheets and images
│       └── stylesheets/     # SCSS design system
│           ├── components/  # Component-specific styles
│           ├── layout/      # Layout and grid styles
│           └── _variables.scss    # Design tokens
├── config/                  # Rails configuration
│   ├── environments/        # Environment-specific settings
│   ├── initializers/        # App initialization
│   ├── deploy.yml          # Kamal deployment config
│   └── database.yml        # Multi-database configuration
├── db/                     # Database schema and migrations
├── spec/                   # RSpec testing suite
└── public/                 # Static assets and error pages
```

## 🚦 Getting Started

### Prerequisites
- **Ruby**: 3.2.2+
- **Node.js**: 20.11.0+
- **PostgreSQL**: 12+
- **Yarn**: 1.22.22+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gimdev
   ```

2. **Backend Setup**
   ```bash
   # Install Ruby dependencies
   bundle install
   
   # Setup database
   rails db:create
   rails db:migrate
   rails db:seed
   ```

3. **Frontend Setup**
   ```bash
   # Install Node.js dependencies
   yarn install
   ```

4. **Environment Configuration**
   ```bash
   # Generate Rails master key
   rails credentials:edit
   
   # Set environment variables
   export RAILS_ENV=development
   export DATABASE_URL=postgresql://localhost/gimdev_development
   ```

5. **Build Assets**
   ```bash
   # Build JavaScript
   yarn build
   
   # Build CSS
   yarn build:css
   ```

6. **Start Development Server**
   ```bash
   # Start Rails server with live reload
   rails server
   ```

7. **Access the Application**
   - Application: [http://localhost:3000](http://localhost:3000)
   - Rails Console: `rails console`

### Available Scripts

```bash
# Backend (Rails)
rails server              # Start Rails development server
rails console             # Rails console for debugging
rspec                     # Run RSpec test suite
rails db:migrate          # Run database migrations
rails credentials:edit    # Edit encrypted credentials

# Frontend (Node.js)
yarn build                # Build JavaScript with esbuild
yarn build:css            # Compile SCSS to CSS
yarn install              # Install dependencies

# Testing & Quality
rspec spec/               # Run all tests
rubocop                   # Check code style
brakeman                  # Security vulnerability scan
```

## 📊 Key Features Deep Dive

### 3D Keyword Visualization
The application features an innovative 3D keyword cloud powered by Three.js:

- **Spherical Layout**: Keywords arranged in a 3D sphere with physics-based positioning
- **Interactive Controls**: TrackballControls for smooth navigation and zoom
- **Dynamic Sizing**: Keyword size based on frequency of use
- **Hover Effects**: Color changes and opacity effects on interaction
- **Click Navigation**: Navigate to keyword-filtered posts by clicking keywords
- **Real-time Updates**: Automatically reflects new keywords from posts

### Rich Content Creation
- **Action Text Integration**: Full-featured rich text editor with image attachments
- **Section Management**: Dynamic post sections with nested form handling
- **Image Processing**: Active Storage with image variants and optimization
- **Live Preview**: Real-time preview of content changes
- **Auto-save**: Prevent content loss with automatic draft saving

### Smart Keyword System
```ruby
# Keyword frequency API endpoint
GET /keywords
# Returns: [{ word: "rails", frequency: 15 }, { word: "javascript", frequency: 8 }]

# Keyword search with autocomplete
GET /keywords/search?query=rai
# Returns: ["rails", "react", "ruby"]
```

## 🎨 Design System

### Color Palette
```scss
--color-primary: hsl(350, 67%, 50%)      // Brand red
--color-primary-rotate: hsl(10, 73%, 54%) // Accent orange
--color-tertiary: hsl(217, 22%, 12%)     // Dark navy
--color-background: hsl(30, 50%, 98%)    // Light cream
--color-text-header: hsl(0, 1%, 16%)     // Dark text
```

### Typography Scale
```scss
--font-size-xs: 0.75rem     // 12px
--font-size-s: 0.875rem     // 14px
--font-size-m: 1rem         // 16px (base)
--font-size-l: 1.125rem     // 18px
--font-size-xl: 1.25rem     // 20px
--font-size-xxl: 1.5rem     // 24px
--font-size-xxxl: 2rem      // 32px
```

### Component Library
- **Buttons**: Multiple variants with hover states and shadows
- **Forms**: Custom form controls with validation styling
- **Cards**: Post cards with hover effects and image overlays
- **Navigation**: Responsive navbar with mobile hamburger menu
- **Breadcrumbs**: Hierarchical navigation with separators

## 🔧 Configuration

### Environment Variables

**Development (.env)**
```bash
RAILS_ENV=development
DATABASE_URL=postgresql://localhost/gimdev_development
RAILS_MASTER_KEY=your_master_key
RAILS_LOG_LEVEL=debug
```

**Production**
```bash
RAILS_ENV=production
DATABASE_URL=postgresql://production_db_url
RAILS_MASTER_KEY=production_master_key
SOLID_QUEUE_IN_PUMA=true
WEB_CONCURRENCY=2
```

### Database Configuration
The application supports multiple database connections:
- **Primary**: Main application data (posts, users, keywords)
- **Cache**: Solid Cache Store for performance
- **Queue**: Solid Queue for background jobs
- **Cable**: Action Cable for real-time features

## 📈 Performance Optimizations

- **Asset Pipeline**: Propshaft for efficient asset delivery
- **Caching Strategy**: Solid Cache Store with Redis-like performance
- **Image Optimization**: Active Storage variants for responsive images
- **JavaScript Bundling**: esbuild for fast development builds
- **CSS Compilation**: Sass with source maps for debugging
- **Database Indexing**: Optimized indexes for keyword and post queries
- **Lazy Loading**: Component-based loading for better performance

## 🧪 Testing

### RSpec Test Suite
```bash
# Run all tests
rspec

# Run specific test types
rspec spec/models/           # Model tests
rspec spec/controllers/      # Controller tests
rspec spec/requests/         # Request integration tests
rspec spec/system/           # System/feature tests
```

**Test Coverage Includes:**
- **Model Tests**: Post, Keyword, User, and Section model validation
- **Controller Tests**: Authentication, CRUD operations, and API endpoints
- **Request Tests**: Full HTTP request/response cycle testing
- **System Tests**: End-to-end user workflow testing with Capybara

### Code Quality Tools
```bash
rubocop                     # Ruby style guide enforcement
rubocop --auto-correct     # Automatic style corrections
brakeman                   # Security vulnerability scanning
```

## 🚀 Deployment

### Fly.io Deployment
```bash
# Deploy to Fly.io
fly deploy

# Check deployment status
fly status

# View application logs
fly logs

# Connect to Rails console
fly ssh console -C "/rails/bin/rails console"
```

### Kamal Deployment (Alternative)
```bash
# Deploy with Kamal
kamal deploy

# Check deployment status
kamal app logs

# Run Rails commands
kamal app exec 'bin/rails console'
```

### Docker Support
```dockerfile
# Multi-stage build optimized for production
FROM ruby:3.2.2 AS builder
# ... build steps ...

FROM ruby:3.2.2-slim AS runtime
# ... runtime configuration ...
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Reset database
rails db:drop db:create db:migrate db:seed

# Check PostgreSQL status
pg_ctl status
```

**Asset Compilation Issues:**
```bash
# Clear asset cache
rm -rf tmp/cache

# Rebuild assets
yarn build && yarn build:css
rails assets:precompile
```

**Three.js Loading Problems:**
- Ensure font files are accessible in `public/` directory
- Check browser console for WebGL compatibility errors
- Verify Three.js controllers are properly imported

**Authentication Issues:**
```bash
# Reset sessions
rails db:migrate:reset
rails credentials:edit  # Verify master key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a pull request

### Development Guidelines
- Follow Rails conventions and best practices
- Use Stimulus controllers for JavaScript interactions
- Add RSpec tests for new features
- Update documentation for API changes
- Follow the established SCSS architecture

## 📝 License

This project is a personal portfolio project demonstrating modern web development practices with Ruby on Rails and advanced frontend technologies.

## 🏆 Key Achievements

- ✅ **Modern Rails 8**: Latest Rails features with Solid Queue and Solid Cache
- ✅ **3D Visualization**: Interactive Three.js keyword cloud with physics
- ✅ **Rich Content**: Action Text with nested sections and image attachments
- ✅ **Progressive Web App**: Service worker with offline capabilities
- ✅ **Responsive Design**: Mobile-first SCSS architecture
- ✅ **Authentication System**: Secure session-based authentication
- ✅ **Performance Optimized**: Caching, asset optimization, and efficient queries
- ✅ **Production Ready**: Multi-environment deployment configuration
- ✅ **Comprehensive Testing**: RSpec test suite with high coverage
- ✅ **Modern JavaScript**: Stimulus controllers with TypeScript support

## 📞 Technical Highlights

### Advanced Features
- **Multi-Database Architecture**: Separate databases for caching, jobs, and cable
- **Real-time Interactions**: Turbo integration for seamless navigation
- **Custom Authentication**: Session-based auth with rate limiting
- **Interactive Components**: Stimulus controllers for rich user interactions
- **3D Graphics Programming**: Complex Three.js integration with font loading
- **Responsive Media Queries**: SCSS mixins for consistent breakpoints

**Built with ❤️ using Ruby on Rails 8, Three.js, and modern web technologies**

---

*Gimdev represents a comprehensive exploration of modern web development, combining Rails' powerful backend capabilities with cutting-edge frontend technologies to create an engaging blogging platform.*


