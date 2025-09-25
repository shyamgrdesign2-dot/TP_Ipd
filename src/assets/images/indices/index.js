// Import icon collections
import { defaultIcons as assessmentIcons } from '../assessmentIcons';
import { defaultIcons as otNotesIcons } from '../otNotesIcons';

// Combine both icon collections into a single defaultIcons object
const defaultIcons = {
  ...assessmentIcons,
  ...otNotesIcons,
};

// Export individual collections for backward compatibility
export { assessmentIcons, otNotesIcons };

// Export combined icons as both named and default export
export { defaultIcons };
export default defaultIcons;
