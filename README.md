# Identity Reconciliation

A REST API built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose** to reconcile customer identities based on email addresses and phone numbers.

The service identifies whether multiple requests belong to the same customer and returns a consolidated identity while maintaining primary and secondary contact relationships.

---

## Features

- Create a new primary contact if no matching contact exists.
- Create a secondary contact when new information is received.
- Merge two primary contacts if they are later identified as the same person.
- Return a consolidated response containing:
  - Primary Contact ID
  - All associated emails
  - All associated phone numbers
  - All secondary contact IDs

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv

---

## Project Structure

```
identity-reconciliation
│
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── db
│   └── app.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/<kh9wqydrth-star>/identity-reconciliation.git
```

Move into the project

```bash
cd identity-reconciliation
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=4551
MONGODB_URI=your_mongodb_connection_string
```

---

## Run the Project

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

Server will run at

```
http://localhost:4551
```

---

## API Endpoint

### Identify Contact

**POST**

```
/identify
```

### Request Body

```json
{
    "email": "john@example.com",
    "phoneNumber": "9876543210"
}
```

---

## Sample Response

```json
{
    "contact": {
        "primaryContactId": "6872b9a4dba0c6b8c1f12345",
        "emails": [
            "john@example.com",
            "john.doe@example.com"
        ],
        "phoneNumbers": [
            "9876543210",
            "9999999999"
        ],
        "secondaryContactIds": [
            "6872b9a4dba0c6b8c1f12346",
            "6872b9a4dba0c6b8c1f12347"
        ]
    }
}
```

---

## Contact Schema

| Field | Type |
|--------|------|
| email | String |
| phoneNumber | String |
| linkedId | ObjectId |
| linkPrecedence | primary / secondary |
| createdAt | Date |
| updatedAt | Date |

---

## Identity Resolution Logic

The API follows these rules:

- If no matching email or phone number exists, create a **Primary Contact**.
- If a matching contact exists and new information is provided, create a **Secondary Contact** linked to the primary.
- If a request connects two different primary contacts, merge them by:
  - Keeping the oldest contact as the primary.
  - Converting the newer primary into a secondary.
  - Updating all linked secondary contacts.

---

## Testing

The API was tested using Postman for the following scenarios:

- New contact creation
- Existing contact lookup
- Secondary contact creation
- Primary contact merge
- Secondary contact lookup
- Identity graph validation

---

## Future Improvements

- MongoDB Transactions
- Unit Tests using Jest
- Docker Support
- Swagger API Documentation
- Deployment on Render

---

## Author

**Karan Baghel**

GitHub:
https://github.com/<kh9wqydrth-star>