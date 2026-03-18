export interface FormattedReview {
  id: string;
  reviewerName: string;
  date: string;
  subRatings: {
    consideration: number;
    cleanliness: number;
    finance: number;
  };
  comment: string;
  helpfulCount: number;
  isVerified: boolean;
}