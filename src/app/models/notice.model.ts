export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
}
