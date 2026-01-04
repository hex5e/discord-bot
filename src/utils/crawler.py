"""Job crawler utilities.

Reusable functions for crawling jobs using python-jobspy.
"""
import asyncio
import math
from concurrent.futures import ThreadPoolExecutor
from jobspy import scrape_jobs
from src.utils.constants import CRAWLER
from src.utils.logger import logger


def _is_valid(value) -> bool:
    """Check if a value is valid (not None, NaN, or empty string)."""
    if value is None:
        return False
    if isinstance(value, float) and math.isnan(value):
        return False
    if isinstance(value, str) and value.strip() == "":
        return False
    return True


def _get_valid(job_dict: dict, key: str, default=None):
    """Get a value from dict, returning default if invalid."""
    value = job_dict.get(key)
    return value if _is_valid(value) else default


def parse_job(job_dict: dict, default_location: str = None, is_remote_search: bool = False) -> dict:
    """
    Parse a job row from jobspy into a standardized format.

    Args:
        job_dict: Raw job dictionary from jobspy DataFrame row
        default_location: Fallback location if job location is missing
        is_remote_search: Whether this is a remote job search

    Returns:
        Standardized job dictionary
    """
    # Debug log raw salary data
    logger.debug("Raw job data", {
        "title": job_dict.get("title"),
        "min_amount": job_dict.get("min_amount"),
        "max_amount": job_dict.get("max_amount"),
        "interval": job_dict.get("interval"),
        "location": job_dict.get("location"),
    })

    # Handle location - use "Remote" for remote searches if no location provided
    location = _get_valid(job_dict, "location")
    if not location:
        if is_remote_search or job_dict.get("is_remote"):
            location = "Remote"
        else:
            location = default_location or "Unknown"

    # Build salary string if available
    salary = None
    min_salary = _get_valid(job_dict, "min_amount")
    max_salary = _get_valid(job_dict, "max_amount")
    interval = _get_valid(job_dict, "interval")

    if min_salary is not None or max_salary is not None:
        if min_salary is not None and max_salary is not None:
            salary = f"${min_salary:,.0f} - ${max_salary:,.0f}"
        elif min_salary is not None:
            salary = f"${min_salary:,.0f}+"
        elif max_salary is not None:
            salary = f"Up to ${max_salary:,.0f}"

        if interval:
            salary += f" ({interval})"

    return {
        "title": _get_valid(job_dict, "title") or "Unknown Title",
        "company": _get_valid(job_dict, "company") or "Unknown Company",
        "location": location,
        "salary": salary,
        "link": _get_valid(job_dict, "job_url") or "",
        "is_remote": job_dict.get("is_remote", False),
    }


def _scrape_jobs_sync(
    search_term: str,
    location: str,
    max_results: int,
    is_remote: bool = False,
    job_type: str = None,
    distance: int = None,
) -> list:
    """
    Synchronous job scraping (runs in thread pool).

    Args:
        search_term: Job search term
        location: Location to search
        max_results: Maximum results to fetch
        is_remote: Filter for remote jobs only
        job_type: Filter by job type (fulltime, parttime, internship, contract)
        distance: Search radius in miles

    Returns:
        List of parsed job dictionaries
    """
    jobs = []

    if distance is None:
        distance = CRAWLER["DISTANCE"]
    if job_type is None:
        job_type = CRAWLER["JOB_TYPE"]

    try:
        scrape_params = {
            "site_name": CRAWLER["SITES"],
            "search_term": search_term,
            "location": location,
            "results_wanted": max_results,
            "country_indeed": "USA",
            "hours_old": CRAWLER["HOURS_OLD"],
            "is_remote": is_remote,
            "distance": distance,
            "verbose": 0,
        }

        # Only add job_type if specified (None would cause validation error)
        if job_type:
            scrape_params["job_type"] = job_type

        results = scrape_jobs(**scrape_params)

        if results is not None and not results.empty:
            for _, job_row in results.iterrows():
                job_dict = job_row.to_dict()
                jobs.append(parse_job(job_dict, location, is_remote_search=is_remote))

        logger.info(f"Found {len(jobs)} jobs for '{search_term}' in {location}")
    except Exception as error:
        logger.error("Error scraping jobs", {"error": str(error)})

    return jobs


async def crawl_jobs(
    search_term: str = None,
    location: str = None,
    max_results: int = None,
    is_remote: bool = False,
    job_type: str = None,
    distance: int = None,
) -> list:
    """
    Crawl jobs asynchronously.

    Args:
        search_term: Job search term (default: from constants)
        location: Location to search (default: from constants)
        max_results: Maximum results (default: from constants)
        is_remote: Filter for remote jobs only
        job_type: Filter by job type (fulltime, parttime, internship, contract)
        distance: Search radius in miles (default: from constants)

    Returns:
        List of job dictionaries
    """
    if search_term is None:
        search_term = CRAWLER["SEARCH_TERM"]
    if location is None:
        location = CRAWLER["LOCATION_COLUMBUS"]
    if max_results is None:
        max_results = CRAWLER["MAX_RESULTS"]

    # Run blocking scrape in thread pool to avoid blocking event loop
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        jobs = await loop.run_in_executor(
            pool,
            lambda: _scrape_jobs_sync(
                search_term=search_term,
                location=location,
                max_results=max_results,
                is_remote=is_remote,
                job_type=job_type,
                distance=distance,
            ),
        )

    return jobs


def format_jobs_message(jobs: list, job_type: str) -> str:
    """
    Format jobs list into a Discord message (max 2000 chars).

    Args:
        jobs: List of job dictionaries
        job_type: Label for the job type (e.g., "Columbus", "Remote")

    Returns:
        Formatted message string
    """
    if not jobs:
        return f"❌ No {job_type} jobs found."

    content = f"✅ Found **{len(jobs)}** {job_type} jobs:\n\n"
    max_len = 2000

    for i, job in enumerate(jobs):
        remote_tag = " 🏠" if job.get("is_remote") else ""
        line = f"**{i + 1}. {job['title']}** @ {job['company']}{remote_tag}\n"
        if job.get("salary"):
            line += f"   💰 {job['salary']}\n"
        line += f"   📍 {job['location']}\n"
        if job.get("link"):
            line += f"   🔗 {job['link']}\n"
        line += "\n"

        if len(content) + len(line) > max_len - 50:
            content += f"_...and {len(jobs) - i} more jobs_"
            break
        content += line

    return content
