# Project Name
  Collaborative

## Overview
This project is an MVP for the Light-weight Collaborative chat space for teams. Follows to the barest minimum, SOLID, DRY, KISS principles. The application is a monolith one as it is not. Uses Socket.io for real-time messaging and includes minimal RBAC, redis implementations for perfomance and rate-limiting 

The File structure sees all feature modularized appropriately

## Documentation 
- Base url: https://collaborative-v1.onrender.com/v1 (HTTP) 
- Postman: 
APIs - https://www.postman.com/kairosclicks/workspace/ko/collection/16936021-d1a99890-7098-4733-a8c0-b36c2c3b0991?action=share&source=copy-link&creator=16936021

Messaging - https://www.postman.com/kairosclicks/workspace/ko/collection/69cbc764b80ea68a9aafebf1?action=share&source=copy-link&creator=16936021

The above are sperated into various collections because the former is HTTP where as the latter is WS and cannot not be in the same collection

- Swagger Open API: https://collaborative-v1.onrender.com/api-documentation

## Features
- Authentication: 
  ### Registration/Onboarding:
  - Register (No email service implemented hence for test purposes, it return a verification code)
  - Verify Email (No email service implemented hence for test purposes, it return a verification code)
  ### Login
  * Basic authentication: Including login, forgot and reset password implementation

- Strict User Input Validations.

- Chat Rooms: User can create chat rooms (or team channel) and then add users to their chat room. where only members are allowed to send or recieve messages.

- Message ReplyTo: a user (who is a member of a chat room) can reply to a single message (For example how it works on Ms Teams, WhatsApp, etc.)

- Message search: A user can search for a keyword amongs all messages effectively using  as search term. See `/messages` endpoint

- Message Status Management

- Open AI Implementation: AI has access to all chat rooms an gets invoked when when mentioned to respond to a message where context is derived by obtaining  summary.

  ### Real time chating events:
    - User upon been added to a chat trigger `joinRoom` listens to:
      * `exception` for catching proper error like unauthorized, missing/empty fields
      * `newMessage` event for new messages
      * `aiThinking` when "@ai" has been mention and is processing responses
  ### Rate Limiting: 
    - Using throlers for HTTP request while a rate limit guate for WS
       
# Assumption 
  - The application is not for person-to-person chat but a shared chat room for teams

## What you should know
- Application was deployed on Render free version and as such makes inital request to delay by 50 second or more
- OpenAI free credits may run out via testing,
- Middleware was used for Enrichment

## Setup 
1. Requires:
 - NodeJS >=18.0
 - NestJS >= 11 
 - TypeScript
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
3. Run:
  ```bash
    npm run migration:run

## Migrations
- To generate migrations run:
  ```bash
    npm run migration:generate src/migrations/{{nameOfYourMigration}} 

- To migrate run:
  ```bash
    npm run migration:run

- To revert run:
  ```bash
    npm run migration:revert

## Testing 
  To run test:
    ```bash
      npm run migration:revert

## Improvements with more time
- Logging 
- Authentication Refresh 
- Message threads. (A bit similar to the replyTo feature but more like a tree)
- Message translation
- Chatroom invite link
- Chatroom roles
- As admin Remove user from chat room
- Email service
- More Unit tests

