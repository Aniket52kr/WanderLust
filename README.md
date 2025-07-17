# Wunderlust  

Wunderlust is a travel and venue booking web application that allows users to explore, book, and interact with travel listings and venues. It combines seamless user experience with robust functionality, making it an ideal platform for wanderlust-driven adventurers and venue hosts.

## Key Features  
1. **User Authentication**:  
   - Signup and login functionality implemented using Passport.js.  
   - Secure session management for users.  

2. **Create, Edit, and Delete Listings**:  
   - Users can create detailed travel listings.  
   - Only the listing owner can edit or delete their listings, ensuring data integrity.  

3. **Ratings and Reviews**:  
   - Any user can leave ratings and reviews for listings.  
   - Helps build community-driven feedback.  

4. **Google Maps Integration**:  
   - Displays the exact location of listings on Google Maps.  
   - Enhances navigation and exploration for users.  

## Technologies Used  
- **Backend**: Node.js, Express.js  
- **Frontend**: EJS (Embedded JavaScript Templates)  
- **Database**: MongoDB Atlas  
- **Authentication**: Passport.js  
- **Others**: npm packages, sessions, Google Maps API  

---

## Future Enhancements (Design-Thinking Approach)

These enhancements are conceptual and focus on improving user experience, engagement, and administrative capabilities:

### 1. Capturing User Search Activity  
**Why it matters**: Understanding what users are searching for helps improve recommendations, identify popular destinations, and refine the UI.

**Approach**:
- Store search queries (destination, date range, filters) in a dedicated `search_logs` collection.
- Use this data to identify trends or frequently searched destinations.
- Eventually power personalized suggestions or show “popular searches” on the homepage.

### 2. Admin Analytics Dashboard  
**Why it matters**: An admin dashboard would provide insights into platform performance, user activity, and listing engagement.

**Approach**:
- Design a protected admin route (`/admin/dashboard`) displaying charts and metrics using Chart.js or D3.js.
- Metrics could include total users, total listings, reviews per listing, top-rated destinations, and peak activity times.
- Aggregate data using MongoDB aggregation pipelines for performance.

### 3. Calendar View for Venue Availability  
**Why it matters**: A visual calendar helps users easily see when a venue is available or booked.

**Approach**:
- Extend each listing with an `availability` schema to store booked date ranges.
- Use a calendar UI library (e.g., FullCalendar or a custom EJS calendar) to display available vs. unavailable dates.
- Allow venue owners to update availability through their dashboard.

### 4. Basic Authentication for Admin and Venue Owners  
**Why it matters**: Segregating roles ensures secure access to specific features, such as venue management or platform oversight.

**Approach**:
- Add a `role` field (e.g., `user`, `venue_owner`, `admin`) in the user model.
- Implement middleware to check user roles before granting access to specific routes.
- Customize the UI to show role-specific dashboards and tools.

---




![Screenshot (240)](https://github.com/user-attachments/assets/02b8a161-230c-443d-8c59-f3322cf5a536)
![Screenshot (241)](https://github.com/user-attachments/assets/f174888c-2c96-4900-9770-30735eb8aa6d)
![Screenshot (242)](https://github.com/user-attachments/assets/b12a18c4-bbea-4b22-b0f4-bd6f5cdeedf9)
![Screenshot (243)](https://github.com/user-attachments/assets/8c6090d8-a6a9-483d-8ecb-fd70e2b26cb2)
![Screenshot (244)](https://github.com/user-attachments/assets/0be9e8ee-592c-4734-8590-beb15b7969e6)
![Screenshot (245)](https://github.com/user-attachments/assets/ceb07c25-bc3b-4411-a173-d979d02774d5)
![Screenshot (246)](https://github.com/user-attachments/assets/c633fb72-8955-4081-8709-a1d818408ce9)



