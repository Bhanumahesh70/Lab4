document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const geolocationBtn = document.getElementById('geolocation-btn');
    const locationInput = document.getElementById('location');
    const resultContainer = document.getElementById('result-container');
  
    // Event listener for search button
    searchBtn.addEventListener('click', function() {
      const location = locationInput.value.trim();
      if (location !== '') {
        searchLocation(location);
      }
    });
  
    // Event listener for geolocation button
    geolocationBtn.addEventListener('click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  
    // Function to handle successful geolocation
    function successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getSunriseSunsetData(latitude, longitude);
    }
  
    // Function to handle geolocation error
    function errorCallback(error) {
      alert('Error getting geolocation: ' + error.message);
    }
  
    
    // Function to search location and get sunrise/sunset data
function searchLocation(location) {
  // Using the correct geocode API endpoint to get latitude and longitude
  const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

  // Make AJAX request to geocode API
  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Geocode API response:', data); // Added this line for debugging

      // Check if the response contains valid data
      const firstResult = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (firstResult && ('lat' in firstResult) && ('lon' in firstResult)) {
        const latitude = firstResult.lat;
        const longitude = firstResult.lon;

        if (latitude && longitude) {
          getSunriseSunsetData(latitude, longitude);
        } else {
          showError('Invalid location data.');
        }
      } else {
        showError('Location not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching location data:', error); // Added this line for debugging
      showError('Error fetching location data.');
    });
}

    // Function to get sunrise/sunset data using the given latitude and longitude
    function getSunriseSunsetData(latitude, longitude) {
      const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;
  
      // Make AJAX request to sunrise/sunset API
      fetch(sunriseSunsetUrl)
        .then(response => response.json())
        .then(data => {
          // Update the dashboard with the response data
          updateDashboard(data.results);
        })
        .catch(error => {
          showError('Error fetching sunrise/sunset data.');
        });
    }
   
    // Function to update the dashboard with sunrise/sunset data
    function updateDashboard(results) {
      // Clear previous results
      resultContainer.innerHTML = '';
  
      // Create elements to display the data
      const todayData = createDataElement('Today', results);
      const tomorrowData = createDataElement('Tomorrow', results, true);
  
      // Append elements to the result container
      resultContainer.appendChild(todayData);
      resultContainer.appendChild(tomorrowData);
    }
  
    // Function to create an element for displaying data
    function createDataElement(day, results, isTomorrow = false) {
      const dataElement = document.createElement('div');
      dataElement.className = 'data';
    
      // Add data to the element
      dataElement.innerHTML = `<h2>${day}</h2>
                               <p><i class="fas fa-solid fa-sun"></i> Sunrise: ${isTomorrow ? results.sunrise.split(' ')[0] : results.sunrise}</p>
                               <p><i class="far fa-sun"></i> Sunset: ${isTomorrow ? results.sunset.split(' ')[0] : results.sunset}</p>
                               <p><i class="fas fa-adjust"></i> Dawn: ${isTomorrow ? results.dawn.split(' ')[0] : results.dawn}</p>
                               <p><i class="far fa-moon"></i> Dusk: ${isTomorrow ? results.dusk.split(' ')[0] : results.dusk}</p>
                               <p><i class="fas fa-clock"></i> Day Length: ${isTomorrow ? results.day_length.split(' ')[0] : results.day_length}</p>
                               <p><i class="fas fa-sun"></i> Solar Noon: ${isTomorrow ? results.solar_noon.split(' ')[0] : results.solar_noon}</p>
                               <p><i class="fas fa-globe"></i> Timezone: ${results.timezone}</p>`;
    
      return dataElement;
    }
    
  
    // Function to show an error message
    function showError(message) {
      resultContainer.innerHTML = `<div class="error">${message}</div>`;
    }
  });
  