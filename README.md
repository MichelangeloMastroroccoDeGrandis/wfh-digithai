# wfh-request-system

## Overview
This is a Work-from-Home (WFH) Management Software designed to help users log in, track WFH requests from others via a calendar table, and submit their own requests. The project showcases the implementation of a modern React application, emphasizing effective state management, smooth user interactions, real-time data updates, and a clean, user-friendly UI/UX design.

## Key Features
* Login
* Dashboard show WFH Requests and User Information
* View WFH Requests
* Request WFH through Calendar
* Request WFH through Form
* Toggle theme
* Validation - Restrict 3 users per day for WFH request
* Network Mock JSON API - Prepopulate table with 3 users
* Persistent Data with local storage
* Custom Hooks
* Unit tests
* TypeScript
* Deployed to Vercel


## Key Architectural Decisions
Set up with React and Vite with Tailwind.css for styling.

* Vite: I like Vite with React, as development is much faster for hot reloading and bundling and find it useful if creating SSG and SSR applications over CRA. It does have some frustrations, as I mention in Challenges Faced, but overall I like to use it with React applications.
* TailwindCSS: I am a huge fan of TailwindCSS and use it on 99% of projects now. I like the way you can use Tailwind classes and responsive design is much easier.
* Broadcast Channel API: As I often use Websockeets for a full stack application, not ever used it for a React only side without a backend, so used this API to sync storage broadcasts over the tabs - originally I went for an event emitter and observer, but couldn't get it right.
* Feature based architecture: Though I tend to use Next.js for most of my applications and like the App Router and the architecure; I like to set up my projects based on features as easier to find code.
* API Mock: I used Mocky.io which I haven't used before and was very easy to implement. I used this one as it was free and the first one I found.
* State Management: I used two state management; ContextAPI for the User logged in and for handling WFH requests, I used Zustand. I thought about using Redux, but for preference I chose Zustand as more familiar with it, simpler to implement, easy to persist the store, easier to implement and I think Redux works better for bigger applications than this one.
* Storage: To persist data, used Local Storage, which I set through Zustand store.
* Calendar: My aim was to get the app working with a MVP o just set it for a week. In a real application, will have more than one week and let the user choose which month and week etc.
* Deployment: Used Vercel to deply the app.

## Challenges Faced 
* Vite and unit testing - Ran into an issue where I could not get testing to set up properly and run properly. Reading the Vite documentation, it highlighted that Jest does not work well with Vite, but did not go into detail how to resolve. On further investigation online, the TSX file transformations with the “transform” config prop of jest does not work properly with Vite, so to make things simple I used babel to transpile the txs files as well.
* Real time updates - Unfortunately, I made a mistake here and should have focused on this a lot earlier. but due to time constraints, I did not have enough time to work out the issue, so moved on to finish the other features. In a normal situation, like with Node.js and React, I would implement Web Sockets, but as this is React only app, tried to implement an event and listener pattern, but could not get it working. In the end I went for the Broadcast Channel API to sync storage among the tabs, which though had some issues setting up I got working well.
* Calendar - One of the challenges I had was dealing with a calendar for different weeks, so for MVP I just did one week and put the idea to implement other week solutions later, but not got round to it. One of the challenges I had was dealing with the dates but to know which day it refers to, i.e. Monday, Tuesday etc and to not include Saturday and Sunday. So my solution was to hard code it for now.
* Repopulating the data - A couple of challenges I had was related to real time updates and dealing with the mock api users as well as the user I had and then repopulating the data correctly; ran into a couple of issues such as continuous loop and undefined user. I resolved this, by carefully checking useEffect dependencies and not accessing the user until properly loaded.
* Unit tests - A bit rusty writing unit tests, so a couple of things I had forgotten, such as mocking state, custom hooks and providers. To resolve, I got myself familiar with some older code to remind myself.
* Typescript - A couple of warnings were highlighted that had to disable; one for me to look into detail how to resolve but nothing too important.

## Outstanding Items Not Delivered
Though tried to implement all in time; a couple of items were not delivered.

* Real time updates - See Challenges faced. Ran into issues getting events to work on the frontend among tabs. As time was running out and other features needed to be applied. I put this on hold. SOLUTION - After Christmas, found a way to do this which never used before, which was using the Broadcast Channel API. Had some teething issues, especially with mocking for unit tests but got there in the end.
* Register - This was a Nice To Have and ran out of time to implement.
* Tooltip - This was a Nice To Have and almost implemented and stopped due to time.
* Transitions - This was a Nice To Have and almost implemented and stopped due to time.
* Weekly Calendar - At the moment the calendar WFH requests is just for the 23rd December to 27th December. In a real application, would extend to weeks for the whole year.


## Getting Started
1. Clone project.
2. Run `npm i` to install the modules.
3. Run `npm run dev` in the root directory.
4. The terminal will show which localhost port to use. By default the site will be at `http://localhost:5173/`.

## Using the application
1. In the Login screen, follow the validation instructions and enter any name, email, password and role (role has no importance, just a job description)
2. Once logged in, you will be redirected to the Dashboard.
3. Default API mock users will load into the Calendar.
4. Your logged in user will appear at the top of the table.
5. Either add the range of dates you wish to request or select the day in the row in the table for the user logged in.
6. Once a request has been sent, you can hover over the request in the calendar to delete it.
7. You can open another tab and add other users (but real time updates are not applied).
8. To reset the data added and clear the storage, click Logout.

## Deployment
A deployed version can be accessed here:
[wfh-studio](https://wfh-request-system.vercel.app/)


