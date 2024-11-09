# API Documentation

This API provides endpoints for user authentication, chat management with AI assistance, emergency contacts management, and finding nearest hospitals based on location.

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Authentication](#authentication)
    - [Register a New User](#register-a-new-user)
    - [User Login](#user-login)
    - [Update User Details](#update-user-details)
    - [Update Device Token](#update-device-token)
  - [Chat](#chat)
    - [Get All Chats](#get-all-chats)
    - [Get Chat Data](#get-chat-data)
    - [Create a New Chat](#create-a-new-chat)
    - [Add Message to Chat](#add-message-to-chat)
    - [Delete a Chat](#delete-a-chat)
    - [Delete User Account](#delete-user-account)
    - [AI Interaction](#ai-interaction)
  - [Emergency Contacts](#emergency-contacts)
    - [Create an Emergency Contact](#create-an-emergency-contact)
    - [Get Emergency Contacts](#get-emergency-contacts)
    - [Update an Emergency Contact](#update-an-emergency-contact)
    - [Delete an Emergency Contact](#delete-an-emergency-contact)
    - [Trigger Emergency](#trigger-emergency)
  - [Hospitals](#hospitals)
    - [Get Nearest Hospitals](#get-nearest-hospitals)
  - [Error Handling](#error-handling)
  - [Notes](#notes)
- [Short Summary](#short-summary)

## Authentication

### Register a New User

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Description:** Creates a new user account.
- **Request Body:**

```json
{
  "phone_number": "string",
  "first_name": "string",
  "last_name": "string",
  "weight": float,
  "height": float,
  "email": "string",
  "password": "string",
  "device_tokens": ["string"] // Optional
}
```

- **Sample Request:**

```json
{
  "phone_number": "1234567890",
  "first_name": "John",
  "last_name": "Doe",
  "weight": 70.5,
  "height": 175,
  "email": "john.doe@example.com",
  "password": "securepassword",
  "device_tokens": ["device_token_1"]
}
```

- **Sample Response:**

```json
{
  "message": "User created"
}
```

### User Login

- **URL:** `/auth/signin`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "device_token": "string" // Optional
}
```

- **Sample Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword",
  "device_token": "device_token_1"
}
```

- **Sample Response:**

```json
{
  "message": "Signed in",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "phone_number": "1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "weight": 70.5,
    "height": 175,
    "email": "john.doe@example.com",
    "device_tokens": ["device_token_1"]
  }
}
```

### Update User Details

- **URL:** `/auth/update`
- **Method:** `PUT`
- **Description:** Updates the authenticated user's details.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "phone_number": "string",
  "first_name": "string",
  "last_name": "string",
  "weight": float,
  "height": float,
  "email": "string"
}
```

- **Sample Request:**

```json
{
  "phone_number": "0987654321",
  "first_name": "John",
  "last_name": "Doe",
  "weight": 75.0,
  "height": 180,
  "email": "john.doe@example.com"
}
```

- **Sample Response:**

```json
{
  "message": "User updated successfully."
}
```

### Update Device Token

- **URL:** `/auth/update-device-token`
- **Method:** `PUT`
- **Description:** Updates the user's device token for notifications.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "device_token": "string"
}
```

- **Sample Request:**

```json
{
  "device_token": "new_device_token"
}
```

- **Sample Response:**

```json
{
  "message": "Device token updated."
}
```

## Chat

### Get All Chats

- **URL:** `/api/chats`
- **Method:** `GET`
- **Description:** Retrieves all chats for the authenticated user.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Sample Response:**

```json
[
  {
    "chat_id": "chat_id_1",
    "user_id": "user_id",
    "subject": "Chat Subject",
    "data": [] // Chat messages
  },
  {
    "chat_id": "chat_id_2",
    "user_id": "user_id",
    "subject": "Another Subject",
    "data": []
  }
]
```

### Get Chat Data

- **URL:** `/api/chat/:chat_id`
- **Method:** `GET`
- **Description:** Retrieves messages of a specific chat.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Path Parameters:**
  - `chat_id` - The ID of the chat.

- **Sample Response:**

```json
[
  {
    "role": "user",
    "msg": "Hello"
  },
  {
    "role": "ai",
    "msg": "Hi, how can I assist you today?"
  }
]
```

### Create a New Chat

- **URL:** `/api/chat`
- **Method:** `POST`
- **Description:** Creates a new chat session.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "subject": "string"
}
```

- **Sample Request:**

```json
{
  "subject": "Medical Consultation"
}
```

- **Sample Response:**

```json
{
  "chat_id": "new_chat_id"
}
```

### Add Message to Chat

- **URL:** `/api/chat/:chat_id`
- **Method:** `POST`
- **Description:** Adds a new message to an existing chat.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Path Parameters:**
  - `chat_id` - The ID of the chat.
- **Request Body:**

```json
{
  "data": {
    "role": "user" or "ai",
    "msg": "string"
  }
}
```

- **Sample Request:**

```json
{
  "data": {
    "role": "user",
    "msg": "I have a headache."
  }
}
```

- **Sample Response:**

```json
"Chat data added"
```

### Delete a Chat

- **URL:** `/api/chat/:chat_id`
- **Method:** `DELETE`
- **Description:** Deletes a specific chat.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Path Parameters:**
  - `chat_id` - The ID of the chat.

- **Sample Response:**

```json
"Chat deleted"
```

### Delete User Account

- **URL:** `/api/user`
- **Method:** `DELETE`
- **Description:** Deletes the authenticated user's account.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Sample Response:**

```json
"User deleted"
```

### AI Interaction

- **URL:** `/api/ai?id=chat_id`
- **Method:** `POST`
- **Description:** Sends a message to the AI assistant within a chat.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Query Parameters:**
  - `id` - The ID of the chat.
- **Request Body:**

```json
{
  "data": {
    "role": "user",
    "msg": "string"
  }
}
```

- **Sample Request:**

```json
{
  "data": {
    "role": "user",
    "msg": "I'm experiencing chest pain and shortness of breath."
  }
}
```

- **Sample Response (Non-Emergency):**

```json
{
  "aiResponse": "Please describe your symptoms in more detail."
}
```

- **Sample Response (Emergency):**

```json
{
  "message": "Emergency detected. Please seek immediate medical attention.",
  "details": "Emergency: Your symptoms may indicate a serious condition.",
  "extras": "Messages sent to emergency contacts.",
  "nearestHospital": [
    {
      "name": "City Hospital",
      "address": "123 Main St",
      "distance": "2 km"
    }
  ]
}
```

## Emergency Contacts

### Create an Emergency Contact

- **URL:** `/api/emergency-contacts`
- **Method:** `POST`
- **Description:** Adds a new emergency contact.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "name": "string",
  "relationship": "string",
  "phone_number": "string",
  "email": "string" // Optional
}
```

- **Sample Request:**

```json
{
  "name": "Jane Doe",
  "relationship": "Sister",
  "phone_number": "1234567890",
  "email": "jane.doe@example.com"
}
```

- **Sample Response:**

```json
{
  "message": "Emergency contact created successfully.",
  "contact": {
    "id": "contact_id",
    "user_id": "user_id",
    "name": "Jane Doe",
    "relationship": "Sister",
    "phone_number": "1234567890",
    "email": "jane.doe@example.com"
  }
}
```

### Get Emergency Contacts

- **URL:** `/api/emergency-contacts`
- **Method:** `GET`
- **Description:** Retrieves all emergency contacts for the authenticated user.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`

- **Sample Response:**

```json
[
  {
    "id": "contact_id_1",
    "user_id": "user_id",
    "name": "Jane Doe",
    "relationship": "Sister",
    "phone_number": "1234567890",
    "email": "jane.doe@example.com"
  },
  {
    "id": "contact_id_2",
    "user_id": "user_id",
    "name": "Bob Smith",
    "relationship": "Friend",
    "phone_number": "0987654321",
    "email": "bob.smith@example.com"
  }
]
```

### Update an Emergency Contact

- **URL:** `/api/emergency-contacts`
- **Method:** `PUT`
- **Description:** Updates an existing emergency contact.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "id": "contact_id",
  "name": "string",
  "relationship": "string",
  "phone_number": "string",
  "email": "string" // Optional
}
```

- **Sample Request:**

```json
{
  "id": "contact_id",
  "name": "Jane Smith",
  "relationship": "Sister",
  "phone_number": "1234567890",
  "email": "jane.smith@example.com"
}
```

- **Sample Response:**

```json
{
  "message": "Emergency contact updated successfully.",
  "contact": {
    "id": "contact_id",
    "user_id": "user_id",
    "name": "Jane Smith",
    "relationship": "Sister",
    "phone_number": "1234567890",
    "email": "jane.smith@example.com"
  }
}
```

### Delete an Emergency Contact

- **URL:** `/api/emergency-contacts/:id`
- **Method:** `DELETE`
- **Description:** Deletes an emergency contact by ID.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Path Parameters:**
  - `id` - The ID of the emergency contact.

- **Sample Response:**

```json
{
  "message": "Emergency contact deleted successfully."
}
```

### Trigger Emergency

- **URL:** `/api/emergency-contacts/emergency`
- **Method:** `GET`
- **Description:** Manually triggers an emergency response.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `long: longitude` (User's longitude)
  - `lat: latitude` (User's latitude)

- **Sample Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
long: 77.2090
lat: 28.6139
```

- **Sample Response:**

```json
{
  "message": "Emergency detected. Please seek immediate medical attention.",
  "details": "User-triggered emergency.",
  "extras": "Messages sent to emergency contacts.",
  "nearestHospital": [
    {
      "name": "City Hospital",
      "address": "123 Main St",
      "distance": "2 km"
    }
  ]
}
```

## Hospitals

### Get Nearest Hospitals

- **URL:** `/api/hospitals/nearest`
- **Method:** `POST`
- **Description:** Retrieves a list of nearest hospitals based on provided location.
- **Headers:**
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Request Body:**

```json
{
  "longitude": float,
  "latitude": float
}
```

- **Sample Request:**

```json
{
  "longitude": 77.2090,
  "latitude": 28.6139
}
```

- **Sample Response:**

```json
{
  "hospitals": [
    {
      "name": "City Hospital",
      "address": "123 Main St",
      "distance": "2 km"
    },
    {
      "name": "General Hospital",
      "address": "456 Elm St",
      "distance": "3 km"
    }
  ]
}
```

## Error Handling

All error responses will have the following format:

```json
{
  "error": "Error message describing what went wrong."
}
```

Example of an error response:

```json
{
  "error": "Invalid request parameters."
}
```

## Notes

- Replace `YOUR_JWT_TOKEN` with the token obtained from the login endpoint.
- All endpoints requiring authentication will return `401 Unauthorized` if the token is missing or invalid.
- The `device_tokens` field is used for push notifications; provide it if notifications are required.
- For endpoints that require location (`longitude` and `latitude`), ensure the values are accurate to get correct results.

# Short Summary

This API allows users to sign up, manage chats with AI assistance, handle emergency contacts, and find nearby hospitals. Authentication is required for most endpoints, using JWT tokens. The AI can detect emergencies based on user messages and trigger notifications to emergency contacts.