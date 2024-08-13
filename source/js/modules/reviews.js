/* * * * * * * * * * * * * * * * * * * * * * * *
 * reviews.js
 */
function createReviewsListItemString(review) {
  const formattedDate = new Date(review.date).toLocaleDateString('ru-RU');

  return `
    <li class="reviews-list__item">
      <article class="review">
        <p class="review__rating">
          <span class="visually-hidden">Рейтинг: ${review.rating}</span>
          <span class="stars-icon stars-icon--size_m" data-value="${review.rating}"></span>
        </p>
        <div class="review__content">
          <p>${review.text}</p>
        </div>
        <footer class="review__footer">
          <p class="review__author">${review.author}</p>
          <time class="review__date" datetime="${review.data}">${formattedDate}</time>
        </footer>
      </article>
    </li>
  `;
}
/* * * * * * * * * * * * * * * * * * * * * * * */
