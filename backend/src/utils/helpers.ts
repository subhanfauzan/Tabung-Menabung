/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
};

/**
 * Get the current salary cycle period based on salary day of month.
 * E.g. salaryDay=25: if today >= 25th → period = 25th this month to 24th next month
 *                    if today < 25th  → period = 25th last month to 24th this month
 */
export const getSalaryPeriod = (
  salaryDay: number,
  refDate: Date = new Date(),
): { start: Date; end: Date; label: string } => {
  const today = refDate.getDate();
  const month = refDate.getMonth(); // 0-based
  const year = refDate.getFullYear();

  let startYear: number, startMonth: number;

  if (today >= salaryDay) {
    // We are in the current salary cycle (started this month on salaryDay)
    startYear = year;
    startMonth = month;
  } else {
    // We are before the salary day this month, so cycle started last month
    startMonth = month - 1;
    startYear = year;
    if (startMonth < 0) {
      startMonth = 11;
      startYear = year - 1;
    }
  }

  // Clamp salaryDay to last day of the start month
  const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
  const clampedStartDay = Math.min(salaryDay, daysInStartMonth);

  const start = new Date(startYear, startMonth, clampedStartDay, 0, 0, 0, 0);

  // End is one day before salaryDay in the following month
  const endMonth = startMonth + 1;
  const endYear = endMonth > 11 ? startYear + 1 : startYear;
  const normalizedEndMonth = endMonth > 11 ? 0 : endMonth;
  const daysInEndMonth = new Date(
    normalizedEndMonth === 0 ? endYear : endYear,
    normalizedEndMonth + 1,
    0,
  ).getDate();
  const clampedEndDay = Math.min(salaryDay - 1, daysInEndMonth);
  const end = new Date(
    endYear,
    normalizedEndMonth,
    clampedEndDay,
    23,
    59,
    59,
    999,
  );

  // Build label e.g. "25 Feb – 24 Mar"
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const label = `${start.getDate()} ${monthNames[start.getMonth()]} – ${end.getDate()} ${monthNames[end.getMonth()]}`;

  return { start, end, label };
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d.-]/g, ""));
};

/**
 * Format number as currency
 */
export const formatCurrency = (
  value: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};
