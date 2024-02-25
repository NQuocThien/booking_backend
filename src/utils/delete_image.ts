import { LinkImage } from 'src/modules/users/dto/image';
import { promises as fsPromises } from 'fs';
export default async function deleteImage(linkImage: LinkImage) {
  // console.log('test new function')
  if (linkImage?.url) {
    const imageDirectory = `${process.env.FILE_PATH || 'files'}/images`;
    const imagePath = `${imageDirectory}/${linkImage.filename}`;
    await fsPromises
      .stat(imagePath)
      .then((imageStat) => {
        if (imageStat.isFile()) {
          fsPromises.unlink(imagePath);
          console.log('\t --> deleted old image:', imageStat.isFile());
        }
        console.log('\t --> image found:', imageStat.isFile());
      })
      .catch((e) => console.log('\t --> error:', e.message));
  }
}
