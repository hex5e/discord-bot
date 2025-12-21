/**
 * Remote Jobs Crawler API
 * Stateless API for fetching remote tech jobs
 */

import { scrapeJobs } from "ts-jobspy";
import { parseJob } from "../utils/jobParser.js";
import { CRAWLER } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * Crawl remote tech jobs
 * @param {Object} [options]
 * @param {string} [options.searchTerm] - Job search term
 * @param {number} [options.maxResults] - Max results to fetch
 * @returns {Promise<Array>} Array of job objects
 */
export async function crawl({
  searchTerm = CRAWLER.SEARCH_TERM,
  maxResults = CRAWLER.MAX_RESULTS,
} = {}) {
  const jobs = [];

  try {
    const results = await scrapeJobs({
      searchTerm,
      location: "USA",
      resultsWanted: maxResults,
      countryIndeed: "USA",
      hoursOld: CRAWLER.HOURS_OLD,
      linkedinFetchDescription: true,
      isRemote: true,
    });

    const jobList = results.jobs || [];
    for (const job of jobList) {
      if (job.isRemote) {
        jobs.push(parseJob(job, "Remote"));
      }
    }

    logger.info(`Found ${jobs.length} remote jobs`);
    return jobs;
  } catch (error) {
    logger.error("Error crawling remote jobs", { error: error.message });
    return [];
  }
}
