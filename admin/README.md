# AjoSave Admin Portal

A comprehensive administrative interface for managing the AjoSave fintech platform. This is a separate React application designed to run on a dedicated subdomain (e.g., `admin.ajosave.com`).

## Features

- **Admin Authentication**: Secure login with OTP verification
- **Role-Based Access Control**: Super Admin, Moderator, and Support Agent roles
- **User Management**: View, search, and manage user accounts with KYC verification
- **Group Management**: Monitor savings groups and manage member oversight
- **Transaction Monitoring**: Real-time transaction tracking and fraud detection
- **Support Tickets**: Manage user support requests with priority levels
- **Analytics Dashboard**: Comprehensive platform metrics and reporting
- **Audit Logs**: Complete audit trail of all administrative actions
- **Platform Settings**: Configure transaction limits, KYC requirements, and more

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx       # Main layout wrapper
│   │   │   ├── AdminSidebar.jsx      # Navigation sidebar
│   │   │   └── AdminHeader.jsx       # Top header with user menu
│   │   └── dashboard/
│   │       ├── StatCard.jsx          # Statistics card component
│   │       ├── RecentActivityCard.jsx # Activity feed
│   │       └── AlertsCard.jsx        # Alerts display
│   ├── context/
│   │   └── AdminAuthContext.jsx      # Authentication context
│   ├── pages/
│   │   ├── AdminLogin.jsx            # Login page
│   │   ├── AdminDashboard.jsx        # Main dashboard
│   │   ├── UserManagement.jsx        # User management page
│   │   ├── GroupManagement.jsx       # Group management page
│   │   ├── TransactionMonitoring.jsx # Transaction monitoring
│   │   ├── SupportTickets.jsx        # Support tickets page
│   │   ├── Analytics.jsx             # Analytics dashboard
│   │   ├── AuditLogs.jsx             # Audit logs page
│   │   └── Settings.jsx              # Platform settings
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS config
└── README.md                         # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin portal will be available at `http://localhost:5174`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables

Create a `.env.local` file in the admin directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_SUBDOMAIN=admin.ajosave.com
```

## Authentication Flow

1. Admin enters phone number and password
2. System sends OTP to registered phone number
3. Admin enters OTP to complete authentication
4. JWT token is issued and stored in localStorage
5. Token is included in all API requests

### Session Management

- Session timeout: 30 minutes of inactivity
- Automatic logout on session expiration
- Re-authentication required for sensitive actions

## Role-Based Access Control

### Super Admin
- Full access to all features
- User and admin management
- Platform settings configuration
- Audit log access

### Moderator
- User management and KYC verification
- Group management and dispute resolution
- Transaction monitoring
- Support ticket management
- Analytics access

### Support Agent
- View user information
- Respond to support tickets
- View transaction history
- Limited analytics access

## API Integration

The admin portal connects to the backend API at `/api/admin/*` endpoints:

- `POST /api/admin/auth/send-otp` - Send OTP for login
- `POST /api/admin/auth/verify-otp` - Verify OTP and get token
- `GET /api/admin/users` - Get user list
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users/:id/suspend` - Suspend user
- `POST /api/admin/users/:id/kyc/approve` - Approve KYC
- `POST /api/admin/users/:id/kyc/reject` - Reject KYC
- `GET /api/admin/groups` - Get groups list
- `GET /api/admin/groups/:id` - Get group details
- `GET /api/admin/transactions` - Get transactions
- `POST /api/admin/transactions/:id/reverse` - Reverse transaction
- `GET /api/admin/support-tickets` - Get support tickets
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/audit-logs` - Get audit logs
- `GET /api/admin/settings` - Get platform settings
- `PUT /api/admin/settings` - Update platform settings

## Deployment

### Subdomain Setup

For production, configure your domain to point to the admin portal:

1. **DNS Configuration**: Add a CNAME record for `admin.ajosave.com` pointing to your hosting
2. **SSL Certificate**: Ensure HTTPS is enabled for the subdomain
3. **CORS Configuration**: Update backend CORS settings to allow requests from `admin.ajosave.com`

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

#### Vercel (Recommended)
```bash
vercel deploy
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure your web server to serve `index.html` for all routes

## Security Considerations

- All API calls use HTTPS in production
- JWT tokens are stored in localStorage (consider using httpOnly cookies for enhanced security)
- Sensitive actions require re-authentication
- All admin actions are logged in the audit trail
- Input validation on all forms
- CSRF protection on state-changing operations
- Rate limiting on authentication endpoints

## Performance Optimization

- Lazy loading for list pages
- Pagination with 50 items per page
- Data caching for frequently accessed information
- Optimized bundle size with tree-shaking
- Image compression and optimization

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Troubleshooting

### Login Issues
- Verify backend API is running
- Check network tab for API errors
- Ensure OTP is entered within 5 minutes

### Data Not Loading
- Check API response in browser DevTools
- Verify admin has appropriate permissions
- Check backend database connectivity

### Styling Issues
- Clear browser cache
- Rebuild Tailwind CSS: `npm run build`
- Check for conflicting CSS classes

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

Proprietary - AjoSave Platform

## Support

For issues or questions, contact: admin-support@ajosave.com
