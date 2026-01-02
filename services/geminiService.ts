import { GoogleGenAI } from "@google/genai";
import { ModelConfig, ProductConfig, SceneConfig } from "../types";

export const generateImagePrompt = (
  model: ModelConfig,
  product: ProductConfig,
  scene: SceneConfig,
  hasSourceImage: boolean
): string => {
  // Klasifikasi jenis produk untuk instruksi spesifik
  const isFoodOrDrink = [
    "Burger",
    "Sushi",
    "Pizza",
    "Steak",
    "Ramen",
    "Salad",
    "Kue",
    "Donat",
    "Nasi",
    "Kopi",
    "Teh",
    "Minuman",
    "Jus",
    "Boba",
  ].some((kw) => product.category.includes(kw));
  const isSmallObject = [
    "Cincin",
    "Perhiasan",
    "Lipstik",
    "Skincare",
    "Parfum",
    "Earbuds",
    "Smartphone",
    "Lilin",
    "Mug",
  ].some((kw) => product.category.includes(kw));

  let technicalInstruction =
    "High-end commercial photography, sharp focus, professional color grading, 8k resolution.";
  if (isFoodOrDrink) {
    technicalInstruction +=
      " Macro photography style, appetizing textures, steam or condensation if applicable, vibrant food colors, bokeh background.";
  } else if (isSmallObject) {
    technicalInstruction +=
      " Sharp detail on product textures and labels, reflective surfaces handled professionally, clean composition.";
  }

  const basePrompt = `Professional commercial advertisement photo. 
  Model: ${model.age} ${model.ethnicity} ${model.gender}, hair style: ${model.hairStyle}, expression: ${model.expression}.
  Product: ${product.color} ${product.material} ${product.category}. 
  Product Details: ${product.description}.
  Interaction: The model is ${scene.interactionType} the product.
  Pose & Scene: ${scene.pose} in a ${scene.environment}.
  Lighting & Style: ${scene.lighting} lighting, ${scene.style} style.
  ${technicalInstruction}
  Ensure anatomically correct hands and realistic skin textures. The product should be the main focal point.`;

  if (hasSourceImage) {
    return `ENHANCE THIS IMAGE: Maintain the model's pose and composition from the source. 
    Transform the scene into a professional advertisement. 
    Update the product to be a ${product.color} ${product.category} with ${product.description}. 
    The model should be ${scene.interactionType} it.
    New Environment: ${scene.environment}.
    ${basePrompt}`;
  }

  return basePrompt;
};

export interface ImageData {
  data: string;
  mimeType: string;
}

export const callGenerateImage = async (
  prompt: string,
  aspectRatio: any,
  imageSize: any,
  sourceImage?: ImageData
): Promise<string> => {
  // Menggunakan API_KEY dari environment variable
  // Mendukung process.env (via vite define) dan import.meta.env (standar Vite)
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error(
      "API Key tidak ditemukan. Pastikan variabel API_KEY sudah diatur di Netlify Env."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const parts: any[] = [{ text: prompt }];

    if (sourceImage) {
      parts.unshift({
        inlineData: {
          data: sourceImage.data,
          mimeType: sourceImage.mimeType,
        },
      });
    }

    // Menggunakan gemini-2.5-flash-image untuk kompatibilitas API yang lebih baik di deployment umum
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: imageSize === "1K" ? undefined : imageSize, // Flash image default is 1K
        },
      },
    });

    const candidates = response.candidates || [];
    if (candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Gagal menerima data gambar dari AI.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error(
        "Kunci API tidak valid atau belum diaktifkan untuk model ini."
      );
    }
    throw error;
  }
};
