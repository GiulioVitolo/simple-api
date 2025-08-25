### HOW TO RUN ###
0) Make sure to have NodeJS installed
1) Clone the repository
2) Open the terminal
3) Navigate to the root folder (= '/simple-api', where server.ts is located)
4) Run 'npm install' to install all the necessary dependencies
5) Run 'npm run dev' to run the (locally hosted) server

### HOW TO TEST WITH HTTP REQUESTS ###
The API server will be running locally, any HTTP Client will be sufficient to test the API. Below are the steps to test the API with Postman Browser Client:
1) Go to https://reqbin.com/
2) Test the following endpoints:

  * (POST) http://localhost:3000/events with the following body: 
    {
      "title":"<title>",
      "description":"<description>",
      "datetime":"<datetime>"
    }

    'datetime' needs to be of the following JS Date format: YYYY-MM-DDTHH:MM:SS (e.g. '2025-08-25T00:00:00')

  * (GET)  http://localhost:3000/events

  * (GET)  http://localhost:3000/events/:id

  ### WITH MORE TIME AVAILABLE, ONE COULD... ###
  1) Publicly host the API on an EC2 instance via an NGINX Web Server
  2) Add more bonus features, like deleting an event from the database or retrieving events sorted by datetime
  3) Make an API docs

  ### If this had to serve 10,000 users a day, what would break? ###
  1) GET events returns everything, for a big database this would result in slow queries. We can either limit the SELECT queries to a fixed number of results or add an index.
  2) The API uses SQLite, which serializes the 'write' queries. This leads to large bottlenecks at peak usage times
  3) To get a notification on the event start time, setTimeout() is used. If all users decided to upload an event, there would be thousands of timers using up a lot of memory.
