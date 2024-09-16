export const randomInteger = (fs, min = 0, max = 10) => {
  return min + fs.nextInt() % (max - min + 1);
}

export const randomBoolean = fs => fs.nextFloat() > 0.5 ? true : false

export const randomItem = (fs, array) => array[randomInteger(fs, 0, array.length - 1)]