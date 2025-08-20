
import { fmtMoney } from '../lib/format';
export const CurrencyText = ({ value }: { value: number }) => (
  <span>{fmtMoney(value)}<span className="opacity-60"> exkl. moms</span></span>
);
