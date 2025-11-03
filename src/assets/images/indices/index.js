// Import icon collections
import { defaultIcons as assessmentIcons } from '../assessmentIcons';
import { defaultIcons as otNotesIcons } from '../otNotesIcons';
import { defaultIcons as crossReferralIcons } from '../crossReferralIcons';
import { defaultIcons as dischargeSummaryIcons } from '../dischargeSummaryIcons';
import { defaultIcons as progressNotesIcons } from '../progressNotesIcons';

// Combine both icon collections into a single defaultIcons object
const defaultIcons = {
  ...assessmentIcons,
  ...otNotesIcons,
  ...crossReferralIcons,
  ...dischargeSummaryIcons,
  ...progressNotesIcons
};

// Export individual collections for backward compatibility
export { assessmentIcons, otNotesIcons, crossReferralIcons, dischargeSummaryIcons };

// Export combined icons as both named and default export
export { defaultIcons };
export default defaultIcons;
