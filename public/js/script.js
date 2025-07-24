// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');
    const form = document.querySelector('.needs-validation');
    const starRatingContainer = document.querySelector('.star-rating');
    const ratingFeedback = document.querySelector('.star-rating .invalid-feedback');
    let currentRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });

        star.addEventListener('click', function() {
            currentRating = index + 1;
            ratingValue.value = currentRating;
            selectStars(currentRating);
            
            // Remove validation error when user selects a rating
            starRatingContainer.classList.remove('is-invalid');
            ratingFeedback.style.display = 'none';
        });
    });

    starRatingContainer.addEventListener('mouseleave', function() {
        selectStars(currentRating);
    });

    // Form validation
    form.addEventListener('submit', function(event) {
        let isValid = true;

        // Check if rating is selected
        if (currentRating === 0) {
            event.preventDefault();
            event.stopPropagation();
            
            // Show validation error for star rating
            starRatingContainer.classList.add('is-invalid');
            ratingFeedback.style.display = 'block';
            
            // Scroll to the star rating section
            starRatingContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            isValid = false;
        }

        // Check other form fields
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            isValid = false;
        }

        form.classList.add('was-validated');
        
        return isValid;
    });

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            star.classList.remove('hover', 'selected');
            if (index < rating) {
                star.classList.add('hover');
            }
        });
    }

    function selectStars(rating) {
        stars.forEach((star, index) => {
            star.classList.remove('hover', 'selected');
            if (index < rating) {
                star.classList.add('selected');
            }
        });
    }
});

