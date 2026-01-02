
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface ModelConfig {
  gender: string;
  age: string;
  ethnicity: string;
  hairStyle: string;
  expression: string;
}

export interface ProductConfig {
  category: string;
  description: string;
  color: string;
  material: string;
}

export interface SceneConfig {
  pose: string;
  interactionType: string;
  environment: string;
  lighting: string;
  style: string;
  aspectRatio: AspectRatio;
  resolution: ImageSize;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
