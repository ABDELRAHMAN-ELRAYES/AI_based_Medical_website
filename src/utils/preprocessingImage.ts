import sharp from 'sharp';

export const preprocessImage = async (
  filePath: string,
  dims: number[]
): Promise<Float32Array> => {

  const [batchSize, height, width, channels] = dims; // Expected dims = [1, 128, 128, 3]

  // resize image 128x128 model's expected dimensions
  const buffer = await sharp(filePath)
    .resize(width, height)
    .raw()
    .toBuffer();

  // Normalize pixel values to range [0, 1]
  const imgArray = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    imgArray[i] = buffer[i] / 255.0;
  }

  return imgArray;
};
