$(document).ready(function () {
    let selectedAmenities = {};

    $('input[type="checkbox"]').change(function () {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if (this.checked) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    });
});

$(document).ready(function () {
    function checkApiStatus() {
        $.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
            if (data.status === "OK") {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        }).fail(function () {
            $('#api_status').removeClass('available');
        });
    }

    checkApiStatus();
});

document.addEventListener('DOMContentLoaded', function () {
    const url = 'http://0.0.0.0:5001/api/v1/places_search/';
    const placesSection = document.querySelector('section.places');
    const searchButton = document.querySelector('button');
    let selectedAmenities = {};

    function loadPlaces(filters = {}) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        })
            .then(response => response.json())
            .then(data => {
                placesSection.innerHTML = '';
                data.forEach(place => {
                    const article = document.createElement('article');

                    article.innerHTML = `
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                        <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                    </div>
                    <div class="description">
                        ${place.description}
                    </div>
                `;

                    placesSection.appendChild(article);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    loadPlaces();

    document.querySelectorAll('.amenities input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedAmenities[this.dataset.id] = this.dataset.name;
            } else {
                delete selectedAmenities[this.dataset.id];
            }
        });
    });

    searchButton.addEventListener('click', function () {
        const filters = { amenities: Object.keys(selectedAmenities) };
        loadPlaces(filters);
    });
});
