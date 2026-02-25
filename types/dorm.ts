export interface Dorm {
  id: number;
  slug: string;
  name: string;
  imageUrl: string; 
  price: number;
  locationShort: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  facilities: ('wifi' | 'security' | 'parking')[];
  isVerified?: boolean;
}