**Biometric Time Clock mini project**

This is a Node.js RESTful API created with Express and using MongoDB as a database for a biometric time clock system. It has two models that represent the two collections that exist in the database:

* Employee:
    * id_: String
    * lastName: String
    * firstName: String
    * dateCreated: Date
    * department: String
* Attendance:
    * id_: String
    * EMPLOYEE_IDENTIFIER: String
    * CHECK-IN: String (2020-09-22T10:00:00)
    * CHECK-OUT: String (2020-09-22T18:00:00)
    * COMMENT: String (optional)
    * DURATION: String (8 hours and 0 minutes)

The API has five endpoints:

* Create employee: POST /API/CreateEmp
* Get list of employees: GET /API/GetEmp/:creationDate 
* Perform check-in: POST /API/CheckIn 
* Perform check-out: PATCH /API/CheckOut 
* Calculate time between check-in and check-out: PATCH /API/Duration/:idAttendances 

**Steps to create and run the project:**

1. Install Node.js v20.9.0.
2. Create a new directory and navigate to it in a terminal.
3. Run the following command:

```
npm init
```

4. Install the required dependencies (you can find the used version in the file dependencies.txt):

```
npm install joi mongoose express http-server
```

5. Download the `app.js` file and the `models/` directory to the project directory.
6. Run the following command to start the API server:

```
node app.js
```

7. Open another terminal and run the following command to start a local HTTP server:

```
http-server -p 3000
```

8. Open Postman and import the `BiometricTimeClock.postman_collection.json` file to test the API.

**Example requests:**

* Create employee:

```
POST /API/CreateEmp
{
  "lastName": "Doe",
  "firstName": "John",
  "department": "Engineering"
}
```

* Get list of employees:

```
GET /API/GetEmp/:creationDate
```

* Perform check-in:

```
POST /API/CheckIn
{
  "EMPLOYEE_IDENTIFIER": "65411e12b6aca45a0a590923",
  "COMMENT": "Comment is optional"
}
```

* Perform check-out:

```
PATCH /API/CheckOut
{
  "id": "Attendance_IDENTIFIER",
  "COMMENT": "Comment is optional"
}
```

* Calculate time between check-in and check-out:

```
PATCH /API/Duration/:idAttendances
```
