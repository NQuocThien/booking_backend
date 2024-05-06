import { LinkImage } from 'src/modules/users/dto/image';
import { promises as fsPromises } from 'fs';
export type TypeFileImage =
  | 'doctors'
  | 'packages'
  | 'facilities'
  | 'users'
  | 'blogs'
  | '';
const getImageDirectory = (type: TypeFileImage): string => {
  var imageDirectory = `${process.env.FILE_PATH || 'files'}/images`;
  switch (type) {
    case 'doctors':
      imageDirectory = `${imageDirectory}/doctors`;
      break;
    case 'users':
      imageDirectory = `${imageDirectory}/users`;
      break;
    case 'packages':
      imageDirectory = `${imageDirectory}/packages`;
      break;
    case 'facilities':
      imageDirectory = `${imageDirectory}/facilities`;
      break;
    case 'blogs':
      imageDirectory = `${imageDirectory}/blogs`;
      break;
    default:
      imageDirectory = `${imageDirectory}`;
      break;
  }
  return imageDirectory;
};
export default async function deleteImage(
  linkImage: LinkImage,
  typeFileImage: TypeFileImage = '',
) {
  if (linkImage?.url) {
    const imageDirectory = getImageDirectory(typeFileImage);
    const imagePath = `${imageDirectory}/${linkImage.filename}`;
    await fsPromises
      .stat(imagePath)
      .then((imageStat) => {
        console.log('\t --> image found:', imageStat.isFile());
        if (imageStat.isFile()) {
          fsPromises.unlink(imagePath);
          console.log('\t --> deleted old image:', linkImage.url);
        }
      })
      .catch((e) => console.log('\t --> error:', e.message));
  }
}
export async function deleteDocument(linkDocument: LinkImage) {
  if (linkDocument?.url) {
    var documentDirectory = `${process.env.FILE_PATH || 'files'}/documents`;
    const items = linkDocument.url.split('/');
    const filename = items[items.length - 1];
    const imagePath = `${documentDirectory}/${filename}`;
    await fsPromises
      .stat(imagePath)
      .then((imageStat) => {
        console.log('\t --> Document found:', imageStat.isFile());
        if (imageStat.isFile()) {
          fsPromises.unlink(imagePath);
          console.log('\t --> deleted old Document:', linkDocument.filename);
        }
      })
      .catch((e) => console.log('\t --> error:', e.message));
  }
}
