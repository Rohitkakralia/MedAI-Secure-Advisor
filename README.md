# MedAI-Secure-Advisor

A cutting-edge, privacy-focused medical advisory platform built with Next.js. MedAI-Secure-Advisor empowers users to securely consult, store, and manage sensitive medical information with advanced AI-driven features and a sleek user interface.

## 🌟 Features

- **AI Medical Advisor**: Get instant, secure medical advice powered by AI
- **Confidential Consultations**: End-to-end encrypted Documents sharing with medical experts
- **Health Record Management**: Upload, store, and organize medical documents safely
- **Modern UI**: Responsive design with interactive visualizations
- **Granular Privacy Controls**: Manage who can access your health data
- **Multi-device Support**: Seamless experience across desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js, React
- **Styling**: Tailwind CSS
- **Database**: MongoDB 
- **Authentication**: NextAuth.js
- **File Storage**: IPFS
- **AI Integration**: OpenAI API
- **UI Effects**: TSParticles
- **Icons**: Lucide React, React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB database
- EdgeStore account for file storage
- OpenAI API key for AI features

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rohitkakralia/MedAI-Secure-Advisor.git
   cd MedAI-Secure-Advisor
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
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
MedAI-Secure-Advisor/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── dashboard/         # Dashboard pages
│   ├── advisor/           # AI medical advisor pages
│   ├── records/           # Health record management
│   └── ...                # Other app routes
├── models/                # Database models
├── public/                # Static assets
└── ...                    # Configuration files
```

## 🔒 Security Features

- End-to-end encrypted consultations
- Secure file encryption for health records
- Protected API routes
- User authentication and authorization
- Privacy controls for shared medical data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenAI for AI integration
- All contributors who have helped shape this project
- The open-source community for their invaluable tools and libraries

🧑‍💻 Author  
Rohit Kakralia

LinkedIn: https://www.linkedin.com/in/rohit-kakralia-a35046251/

GitHub: https://github.com/Rohitkakralia
# MedAI-