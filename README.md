# Secure Vault

A modern, secure file storage and sharing platform built with Next.js. Secure Vault provides a robust solution for storing, managing, and sharing files with advanced security features and a beautiful user interface.

## 🌟 Features

- **Secure Authentication**: Built-in user authentication and authorization system
- **File Management**: Upload, store, and manage your files securely
- **User Profiles**: Customizable user profiles with unique usernames
- **Dashboard**: Intuitive dashboard for managing your files and account
- **Modern UI**: Beautiful and responsive design with 3D effects and animations
- **Privacy Controls**: Granular control over file sharing and access
- **Responsive Design**: Works seamlessly across all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Storage**: EdgeStore
- **Form Handling**: Zod for validation
- **UI Effects**: Three.js, Vanta, TSParticles
- **Icons**: Lucide React, React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB database
- EdgeStore account for file storage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rohitkakralia/SecureVault.git
   cd secure-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   EDGESTORE_ACCESS_KEY=your_edgestore_access_key
   EDGESTORE_SECRET_KEY=your_edgestore_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
secure-vault/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── dashboard/         # Dashboard pages
│   ├── profile/          # User profile pages
│   └── ...               # Other app routes
├── models/                # Database models
├── public/               # Static assets
└── ...                   # Configuration files
```

## 🔒 Security Features

- Secure file encryption
- Protected API routes
- User authentication and authorization
- Secure file sharing mechanisms
- Privacy controls for shared content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors who have helped shape this project
- The open-source community for their invaluable tools and libraries


🧑‍💻 Author
Rohit kakralia

LinkedIn:https://www.linkedin.com/in/rohit-kakralia-a35046251/

GitHub:https://github.com/Rohitkakralia
# MedAI-Secure-Advisor
