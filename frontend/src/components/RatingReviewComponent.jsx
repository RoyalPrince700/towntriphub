import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const RatingReviewComponent = ({ booking, onSubmit, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState({
    punctuality: 0,
    professionalism: 0,
    vehicle_condition: 0,
    communication: 0,
    package_handling: booking.type === 'delivery' ? 0 : null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please provide a star rating');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        bookingId: booking._id,
        rating,
        comment,
        feedback,
      };

      // TODO: Implement review submission API call
      console.log('Submitting review:', reviewData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSubmit(reviewData);
    } catch (error) {
      console.error('Review submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating, onRate, onHover) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoverRating || currentRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  const feedbackCategories = [
    { key: 'punctuality', label: 'Punctuality' },
    { key: 'professionalism', label: 'Professionalism' },
    { key: 'vehicle_condition', label: 'Vehicle Condition' },
    { key: 'communication', label: 'Communication' },
    ...(booking.type === 'delivery' ? [{ key: 'package_handling', label: 'Package Handling' }] : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <ThumbsUp className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Rate Your Experience</h3>
        <p className="text-gray-600 mt-2">
          How was your {booking.type} with {booking.driver?.user?.name || 'your driver'}?
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Overall Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Overall Rating *
          </label>
          <div className="flex justify-center">
            {renderStars(rating, setRating, setHoverRating)}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Detailed Feedback
          </label>
          <div className="space-y-4">
            {feedbackCategories.map((category) => (
              <div key={category.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category.label}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, [category.key]: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= feedback[category.key]
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience or suggestions..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Skip Review
          </button>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5 mr-2" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingReviewComponent;
