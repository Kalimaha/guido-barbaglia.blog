export const findImage = (imageNodes, imageName) =>
  imageNodes.find(x => x.original.src.includes(imageName.replace(".webp", "")));