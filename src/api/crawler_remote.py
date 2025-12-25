"""Remote Jobs Crawler API.

Stateless API for fetching remote tech jobs.
"""
from jobspy import scrape_jobs
from src.utils.job_parser import parse_job
from src.utils.constants import CRAWLER
from src.utils.logger import logger


async def crawl(search_term: str = None, max_results: int = None) -> list:
    """
    Crawl remote tech jobs.

    Args:
        search_term: Job search term
        max_results: Max results to fetch

    Returns:
        Array of job objects
    """
    if search_term is None:
        search_term = CRAWLER['SEARCH_TERM']
    if max_results is None:
        max_results = CRAWLER['MAX_RESULTS']

    jobs = []

    try:
        results = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=search_term,
            location="USA",
            results_wanted=max_results,
            country_indeed="USA",
            hours_old=CRAWLER['HOURS_OLD'],
            is_remote=True,
        )

        if results is not None:
            for _, job_row in results.iterrows():
                job_dict = job_row.to_dict()
                if job_dict.get('is_remote'):
                    jobs.append(parse_job(job_dict, "Remote"))

        logger.info(f"Found {len(jobs)} remote jobs")
        return jobs
    except Exception as error:
        logger.error("Error crawling remote jobs", {"error": str(error)})
        return []
