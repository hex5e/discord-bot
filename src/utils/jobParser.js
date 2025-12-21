/**
 * Shared utilities for parsing job data from ts-jobspy
 */

/**
 * Parse a single job object from ts-jobspy response
 * @param {Object} job - Raw job from ts-jobspy
 * @param {string} defaultLocation - Fallback location string
 * @returns {Object} Normalized job object
 */
export function parseJob(job, defaultLocation = "Unknown") {
  let locationStr = defaultLocation;
  if (job.location) {
    const { city, state, country } = job.location;
    locationStr =
      [city, state].filter(Boolean).join(", ") || country || defaultLocation;
  }

  let salary = null;
  if (job.compensation?.minAmount && job.compensation?.maxAmount) {
    salary = `$${job.compensation.minAmount.toLocaleString()} - $${job.compensation.maxAmount.toLocaleString()}`;
  }

  return {
    title: job.title || "Not Available",
    company: job.companyName || "Not Available",
    location: locationStr,
    description: job.description || "Not Available",
    salary,
    link: job.jobUrl || "Not Available",
    source: job.site || "Not Available",
    postedDate: job.datePosted || null,
    isRemote: job.isRemote || false,
    jobType: job.jobType || [],
  };
}
