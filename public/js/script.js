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



// Reviews - Star Rating

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('rating-value');
    let currentRating = 0;

    stars.forEach((star, index) => {
        // mouse hover effects
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });

        // click to select rating
        star.addEventListener('click', function() {
            currentRating = index + 1;
            ratingValue.value = currentRating;
            selectStars(currentRating);
        });
    });

    // reset to selected rating when mouse leaves the rating area
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        selectStars(currentRating);
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