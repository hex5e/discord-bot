"""Shared utilities for parsing job data from jobspy."""


def parse_job(job: dict, default_location: str = "Unknown") -> dict:
    """
    Parse a single job object from jobspy response.

    Args:
        job: Raw job from jobspy
        default_location: Fallback location string

    Returns:
        Normalized job object
    """
    location_str = default_location
    if job.get('location'):
        loc = job['location']
        city = loc.get('city', '')
        state = loc.get('state', '')
        country = loc.get('country', '')
        parts = [p for p in [city, state] if p]
        location_str = ', '.join(parts) if parts else (country or default_location)

    salary = None
    compensation = job.get('compensation')
    if compensation and compensation.get('min_amount') and compensation.get('max_amount'):
        min_amt = compensation['min_amount']
        max_amt = compensation['max_amount']
        salary = f"${min_amt:,} - ${max_amt:,}"

    return {
        'title': job.get('title') or "Not Available",
        'company': job.get('company') or "Not Available",
        'location': location_str,
        'description': job.get('description') or "Not Available",
        'salary': salary,
        'link': job.get('job_url') or "Not Available",
        'source': job.get('site') or "Not Available",
        'postedDate': job.get('date_posted'),
        'isRemote': job.get('is_remote', False),
        'jobType': job.get('job_type', []),
    }
