// 1. Grab all the HTML elements by their IDs
const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const spinner = document.getElementById('loading-spinner');
const errorMsg = document.getElementById('error-message');

// 2. Main function to search for a country
async function searchCountry(countryName) {
    if (!countryName) return;

    // Reset the UI for every new search
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
    countryInfo.innerHTML = '';
    borderSection.innerHTML = '';
    spinner.classList.remove('hidden'); 
    try {

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('Country not found. Please check your spelling.');
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        if (country.borders && country.borders.length > 0) {
            fetchBorders(country.borders);
        } else {
            borderSection.innerHTML = '<p>This country has no land borders.</p>';
        }

    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden'); 
    } finally {
        spinner.classList.add('hidden'); 
    }
}

async function fetchBorders(codes) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}`);
        const borders = await response.json();

        borderSection.innerHTML = '<h3>Bordering Countries:</h3>';
        
        borders.forEach(border => {
            const borderDiv = document.createElement('div');
            borderDiv.className = 'border-item';
            borderDiv.innerHTML = `
                <p>${border.name.common}</p>
                <img src="${border.flags.svg}" alt="${border.name.common} flag">
            `;
            borderSection.appendChild(borderDiv);
        });
    } catch (err) {
        console.error("Error fetching borders:", err);
    }
}

searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});

