# FeedbackThing.pro

FeedbackThing.pro is a modern, feedback management platform built to streamline user insights and improve product iterations. It’s designed with a focus on performance, scalability, and ease of development, leveraging cutting-edge technologies and best practices.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Overview

FeedbackThing.pro offers a seamless way to collect, manage, and analyze user feedback. Built with modern frameworks and tools, it ensures an efficient development process and a robust user experience.

## Features

- **Centralized Feedback Management:** Easily gather and organize user feedback in one place.
- **Real-Time Updates:** Experience lightning-fast performance with Next.js and TurboRepo.
- **Comprehensive API:** Leverage an OpenAPI-defined interface for seamless integrations.
- **Detailed Documentation:** Extensive project documentation powered by Mintlify.
- **Secure Authentication:** Robust user authentication managed by Clerk.

## Technologies Used

- **Turborepo:** Monorepo tool to manage the project’s multiple packages and apps efficiently.
- **Next.js 15:** Provides a React framework optimized for performance and SEO.
- **OpenAPI:** Defines the structure of APIs to ensure consistency and reliability.
- **Mintlify:** Used for generating and hosting the project’s documentation.
- **Clerk:** Manages user authentication and authorization.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/feedbackthing.pro.git
cd feedbackthing.pro
```
2. **Install dependencies:**

```bash
pnpm install
```

3. **Configure environment variables:**

Create a .env file at the root of the project and add the necessary environment variables. Refer to the sample file (.env.example) for guidance.

4. **Run the development server:**

```bash
pnpm run dev
```

Open http://localhost:3000 to view the application in your browser.

## API Documentation
The project API is defined using OpenAPI. You can find the complete API specification in the docs/api directory or visit our hosted documentation powered by Mintlify at https://docs.feedbackthing.pro.

## Authentication
Authentication is handled by Clerk, ensuring a secure and smooth login experience. For more information on configuration and customization, please refer to the Clerk documentation.

