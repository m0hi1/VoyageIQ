const CalculateAvg = reviews => {
  if (!reviews || reviews.length === 0) {
    return {
      totalRating: 0,
      avgRating: 0, // Return 0 if no reviews
    };
  }

  const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);

  if (totalRating === 0) {
    return {
      totalRating: 0,
      avgRating: 0, // Return 0 if total rating is 0 (e.g., all reviews are 0 stars)
    };
  }

  // Calculate average and ensure it's a number (potentially rounded to one decimal)
  const average = totalRating / reviews.length;
  // parseFloat is used to ensure it's a number, .toFixed(1) on its own returns a string.
  // If you want to store it with one decimal precision:
  const avgRatingValue = parseFloat(average.toFixed(1));
  // Or, if you prefer to keep more precision until display:
  // const avgRatingValue = average;

  return {
    totalRating,
    avgRating: avgRatingValue, // avgRating is now always a number
  };
};

export default CalculateAvg;
