export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  notes: string[];
  description: string;
  mood: string;
}

export interface CartItem extends Perfume {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}