'use client';
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  interactive = false,
  onRate,
  showValue = true,
}) => {
  const [hovered, setHovered] = React.useState(0);
  const displayRating = hovered || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors duration-150`}
        >
          <Star
            size={size}
            className={`${
              star <= displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
