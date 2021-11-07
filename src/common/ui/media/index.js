
import divWithClassName from '../divWithClassName';
import styles from './media.scss';
export { styles as Classes };

export const MediaBody = divWithClassName(styles['media-body'], 'MediaBody');

const Media = divWithClassName(styles.media, 'Media');
Media.Body = MediaBody;
export default Media;
