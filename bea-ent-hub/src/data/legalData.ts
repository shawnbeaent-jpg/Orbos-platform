import { JurisdictionOption, MailboxProvider, NaicsCode, RoyaltyOrg } from '../types';

// Real Secretary of State business-filing portals. A representative set of
// common LLC-formation jurisdictions, not an exhaustive 50-state list.
export const JURISDICTIONS: JurisdictionOption[] = [
  { state: 'Georgia', abbr: 'GA', filingUrl: 'https://ecorp.sos.ga.gov', filingFeeNote: '$100 online LLC filing fee' },
  { state: 'Delaware', abbr: 'DE', filingUrl: 'https://corp.delaware.gov/', filingFeeNote: '$90 LLC formation fee + annual franchise tax' },
  { state: 'California', abbr: 'CA', filingUrl: 'https://bizfileonline.sos.ca.gov/', filingFeeNote: '$70 filing fee + $800 annual franchise tax' },
  { state: 'New York', abbr: 'NY', filingUrl: 'https://dos.ny.gov/division-corporations', filingFeeNote: '$200 filing fee + publication requirement' },
  { state: 'Texas', abbr: 'TX', filingUrl: 'https://www.sos.state.tx.us/corp/', filingFeeNote: '$300 Certificate of Formation fee' },
  { state: 'Florida', abbr: 'FL', filingUrl: 'https://dos.myflorida.com/sunbiz/', filingFeeNote: '$125 filing fee' },
  { state: 'Tennessee', abbr: 'TN', filingUrl: 'https://tnbear.tn.gov/Ecommerce/', filingFeeNote: '$300 minimum LLC filing fee' },
];

// Real 2022 NAICS codes relevant to independent music businesses.
export const NAICS_CODES: NaicsCode[] = [
  { code: '711130', label: 'Musical Groups and Artists', description: 'Bands, ensembles, and solo performing artists primarily engaged in live performance.' },
  { code: '711510', label: 'Independent Artists, Writers, and Performers', description: 'Independent songwriters, composers, and performers working on a project/freelance basis — the most common code for a solo indie artist.' },
  { code: '512210', label: 'Record Production', description: 'Producing and releasing master recordings; production companies and beatmakers who own/sell masters.' },
  { code: '512230', label: 'Music Publishers', description: 'Acquiring and licensing musical compositions; publishing administration entities.' },
  { code: '512240', label: 'Sound Recording Studios', description: 'Operating a recording studio and providing recording/mixing services to others.' },
  { code: '512250', label: 'Record Labels', description: 'Managing artists\' careers and marketing/promoting sound recordings under a label entity.' },
  { code: '711410', label: 'Agents and Managers for Artists, Athletes, Entertainers', description: 'Talent management and booking agency operations representing artists.' },
];

function naicsKeywordMatch(description: string): NaicsCode[] {
  const d = description.toLowerCase();
  const hits = new Set<string>();
  if (/(perform|live show|tour|gig|concert|band)/.test(d)) hits.add('711130');
  if (/(songwrit|solo|freelance|independent artist|self-releas|write|compose)/.test(d)) hits.add('711510');
  if (/(produc|beat|master|engineer|mix|record label owner)/.test(d)) hits.add('512210');
  if (/(publish|licens|sync|catalog administration)/.test(d)) hits.add('512230');
  if (/(studio|record other artists|rent.*studio|booth)/.test(d)) hits.add('512240');
  if (/(label|roster|sign artists|market.*artist)/.test(d)) hits.add('512250');
  if (/(manage|booking agent|represent artist|agency)/.test(d)) hits.add('711410');
  if (hits.size === 0) hits.add('711510');
  return NAICS_CODES.filter((n) => hits.has(n.code));
}

export function consultNaics(description: string): NaicsCode[] {
  return naicsKeywordMatch(description);
}

// Real registered-agent / virtual mailbox services commonly used by solo LLC filers.
export const MAILBOX_PROVIDERS: MailboxProvider[] = [
  { name: 'Northwest Registered Agent', url: 'https://www.northwestregisteredagent.com/', note: 'Registered agent + business address bundle, strong privacy protection.' },
  { name: 'iPostal1', url: 'https://ipostal1.com/', note: 'Virtual mailbox network with real street addresses in most major cities.' },
  { name: 'Anytime Mailbox', url: 'https://www.anytimemailbox.com/', note: 'Scan-on-demand virtual mailbox, wide location coverage.' },
  { name: 'Physical Address', url: 'https://physicaladdress.com/', note: 'Business-focused virtual address with mail forwarding.' },
];

export const ROYALTY_ORG_LINKS: Record<RoyaltyOrg, { url: string; note: string }> = {
  ASCAP: { url: 'https://www.ascap.com/join', note: 'Performing rights organization — pick one PRO (ASCAP, BMI, or SESAC), not all three.' },
  BMI: { url: 'https://www.bmi.com/creators', note: 'Performing rights organization — free to join as a songwriter.' },
  SESAC: { url: 'https://www.sesac.com/', note: 'Invitation-based PRO; smaller roster, higher-touch service.' },
  SoundExchange: { url: 'https://www.soundexchange.com/register/', note: 'Collects digital/satellite performance royalties — separate from your PRO, easy to miss.' },
  Songtrust: { url: 'https://www.songtrust.com/', note: 'Global publishing administration — collects mechanical & sync royalties worldwide.' },
  'The MLC': { url: 'https://www.themlc.com/join', note: 'U.S. Mechanical Licensing Collective — collects streaming mechanical royalties, free to join.' },
};

export const EIN_APPLICATION_URL = 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online';
export const COPYRIGHT_OFFICE_URL = 'https://www.copyright.gov/registration/';
