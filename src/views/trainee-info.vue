<template>
  <div class="center-container">
    <div class='INFOCONTAINER'>
      <div class='NAME'>
        <h5>MARYNE R. MAGHANOY</h5>
      </div>
      <div class='DATE'>
        <h4>Date Started: July 10, 2025</h4>
      </div>
      <!-- Use a button with a click handler -->
      <button @click="goToApp" class="go-to-app-button">Go to App</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomePage", // It's good practice to name your component
  methods: {
    goToApp() {
      // Use the router instance to push to the new route
      this.$router.push('/todoLists');
    }
  }
}
</script>

<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.go-to-app-button {
  display: inline-block;
  padding: 12px 24px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  text-decoration: none; /* Not strictly needed for a button, but doesn't harm */
  font-family: inherit; /* Ensures the button uses the same font as the rest of the page */
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  margin-top: 20px;
}

.go-to-app-button:hover {
  background-color: #45a049;
}

.go-to-app-button:active {
  background-color: #3e8e41;
}

.INFOCONTAINER {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.NAME h5, .DATE h4 {
  margin: 0;
}
</style>