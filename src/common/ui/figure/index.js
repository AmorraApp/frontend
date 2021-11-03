import divWithClassName from '../divWithClassName';
import * as styles from './figure.scss';
export { styles as Classes };
import Image, { propTypes as imagePropTypes } from 'common/ui/image';


export const FigureImage = divWithClassName(styles['figure-image'], 'FigureImage', { as: Image }, imagePropTypes);
FigureImage.defaultPropTypes = { fluid: true };

export const FigureCaption = divWithClassName(styles['figure-caption'], 'FigureCaption', { as: 'figcaption' });

const Figure = divWithClassName(styles.figure, 'Figure', { as: 'figure' });
Figure.Image = FigureImage;
Figure.Caption = FigureCaption;

export default Figure;
