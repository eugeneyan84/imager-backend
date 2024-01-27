# Imager (Backend)

Imager is a simple web-application that allows users to browse and share places of interests.

## Background

This repository holds the backend source-code.

Imager backend is an Express application built on NodeJS using Vite, and serves as a REST API for the frontend to communicate places and users data back and forth the MongoDB storage.

**Express Validator** provides a means to perform field validation as a middleware in routes, as well as aggregate validation outcomes in the controllers.

**Multer** facilitates handling of image payloads from incoming POST requests, as well as persistence to disk storage within hosted space.

**Mongoose** caters methods to perform CRUD operations for places and users records in MongoDB collections.

Authentication is carried out via issuance and verification of tokens to and from the frontend, especially for save/update/delete actions that require protection against unauthorized changes, and is done so with the **jsonwebtoken** library.

Other dependencies include **uuid** for identifier-generation, **bcryptjs** for password hashing and verification, **axios** for querying Google reverse-geocoding API, **dotenv** for handling of environment variables, and **nodemon** aiding hot-reloading of development activities.

Imager (frontend) repository can be accessed [here](https://github.com/eugeneyan84/imager-frontend).

## Routes

### Places

| Routes                     | Method | Description                                                                                                                                                                                                                                                                           | Protected |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| "/api/places/placeId"      | GET    | Retrieves an existing Place record from MongoDB of the targeted place identifier in the URL.                                                                                                                                                                                          | No        |
| "/api/places/user/:userId" | GET    | Retrieves a list of all Place records that are associated with a user of the provided user identity in the URL.                                                                                                                                                                       | No        |
| "/api/places"              | POST   | Creates a new Place record based on multi-part form data consisting of text fields and image payload. Text data is save to MongoDB, while image is written to disk storage. Record is associated with user identity encrypted within JWT.                                             | Yes       |
| "/api/places/:placeId"     | PATCH  | Updates a Place record within MongoDB of the targeted place identifier in the URL. Verifies that the targeted place is authored by the same user identity that is encrypted within the JWT. Only title and description can be updated via this method.                                | Yes       |
| "/api/places/:placeId"     | DELETE | Removes a place record from MongoDB with the provided place identifier in the URL. Subsequently removes the place identifier from the places array field within User record. Verifies that the targeted place is authored by the same user identity that is encrypted within the JWT. | Yes       |

### Users

| Routes             | Methods | Description                                                                                                                                                                                                                                                                                                                                   | Protected |
| ------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| "api/users"        | GET     | Retrieves all User records.                                                                                                                                                                                                                                                                                                                   | No        |
| "api/users/signup" | POST    | Creates a new User record based on the multi-part form data consisting of name, email, password and avatar image. Text data is saved into MongoDB, while the avatar image is written to disk storage. Upon successful creation of the new User record, a token is generated and returned in the response to immediately sign in the new user. | No        |
| "api/users/login"  | POST    | Verifies user credentials against existing User record. Upon successful verification, a token is generated and returned in the response to sign in the user                                                                                                                                                                                   | No        |

## Data Dictionary

### Place

| Column       | Type             | Description                                                                                                                                                     | Mandatory |
| ------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| title        | String           | Name of place.                                                                                                                                                  | Yes       |
| description  | String           | Plain text description/review of the place that was visited. Minimum length of 20 characters.                                                                   | Yes       |
| imageUrl     | String           | Relative path to the place image file that is stored on disk.                                                                                                   | Yes       |
| address      | String           | Full address of the place. This value would be used for submission to Google Maps API for reverse-geocoding, so as a derive the latitude/longitude coordinates. | Yes       |
| location     | Object           | Holds 2 fields, lat and lng                                                                                                                                     | Yes       |
| location.lat | Number           | Latitude value of place, returned from Google Maps API                                                                                                          | Yes       |
| location.lng | Number           | Longitude value of place, returned from Google Maps API                                                                                                         | Yes       |
| places       | Array (ObjectId) | List of Document identifier values of Place records belonging to this User                                                                                      | Yes       |
| creator      | ObjectId         | Document identifier value of User who created this place                                                                                                        | Yes       |

### User

| Column   | Type             | Description                                                                | Mandatory |
| -------- | ---------------- | -------------------------------------------------------------------------- | --------- |
| name     | String           | Name of User                                                               | Yes       |
| email    | String           | Email address of User                                                      | Yes       |
| password | String           | Hashed value of login password                                             | Yes       |
| imageUrl | String           | Relative path to the user avatar file that is stored on disk.              | Yes       |
| places   | Array (ObjectId) | List of Document identifier values of Place records belonging to this User | Yes       |

## Setup

### Pre-requisite:

- MongoDB has been fully set up, i.e. a database with 2 collections, namely **places** and **users**. Note down all the database access credentials.
- A valid API key has been obtained from Google Maps Platform for usage within Imager backend. This key would be used for reverse-geocoding of place address to derive lat/lng coordinates.
- A private key that would serve as a salt value for signing and verifying JWTs.

### Steps:

1. Clone this repository in terminal.

```bash
git clone git@github.com:eugeneyan84/imager-backend.git
```

2. Navigate into the project folder in terminal, install all dependencies.

```bash
npm install
```

3. Rename `.env_template` file in project root directory to `.env`, and provide the necessary values as captured from the _Pre-requisite_ section.

```
# .env file
GOOGLE_API_KEY=<google api key>

PORT=<port value of this backend>

# MongoDb access credentials
IMAGER_APP_HOSTNAME=<MongoDB hostname>
IMAGER_APP_USERNAME=<MongoDB username>
IMAGER_APP_KEY=<MongoDB user password>
IMAGER_APP_DBNAME=<MongoDB database name>

#private key for JWT signing
BACKEND_P_KEY=<key string>
```

From this point on, there are 2 options to serving the frontend:

#### Option A: Serve directly from code server (e.g Visual Studio Code)

4. Navigate to project folder in terminal, run the project:

```bash
npm run start
```

#### Option B: Serve as a Dockerized application

4. Navigate to project folder in terminal and use the following build command:

```bash
docker build -f Dockerfile.dev -t imager-backend .
```

5. After verifying that Docker image has been successfully built, use the following run command in terminal to spin up a container in detached mode.

```bash
docker run -d --env-file ./.env -p 3000:3000 imager-backend
```

_Note: Edit the Docker commands accordingly if you choose to perform additional actions like tagging. Ensure that the path to the .env file is indicated correctly during running._

Standard tools like Postman can be used to test the accessibility of the endpoints documented in the Routes section above, to ensure if the backend is correctly served.

> Written with [StackEdit](https://stackedit.io/).
