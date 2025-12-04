// added an About Us page 
import React from 'react';

const AboutUs = () => {
  return (
    <main className="container">
      <h1>About Us</h1>
      <p>Live Local was created to make it easier for people everywhere to discover and support locally owned businesses. When searching for a place to eat, shop, or find services, it’s often difficult to tell which options are truly local, making it harder for communities to support the businesses that give their neighborhoods character. Our mission is to change that.</p>

<p>Live Local helps you quickly find locally owned cafés, shops, services, and experiences right around you, strengthening community connections through local commerce.</p>
<h2
  style={{
    fontFamily: 'Lobster, cursive',
    color: '#2c3e50',
    fontSize: '2rem',
    textAlign: 'center',
    margin: '1rem 0',
    textDecoration: 'underline',
  }}
>
  How it Works
</h2>
<p>After signing in, you can explore businesses near your location by entering what you're looking for in the search bar, or using our suggested category buttons to see businesses of that specific type. Once you've clicked on a businesses, you can view a short description, as well as view and leave reviews. Our location map at the bottom of the home page automatically centers on the location you entered in your user profile, so that you can see businesses near you. You can also search a specific city to view different businesses in that area. You can also personalize your profile with your interests and location. 
  </p>
  
  <p>
    If you’re a business owner, you can use the Apply tab to submit your locally owned business to our map - this is how all businesses on Live Local are added. Our users and local owners help shape the map, ensuring it stays authentic, community-driven, and up to date.</p>
    </main>
  );
};

export default AboutUs;
