"""Application constants and configuration."""

CRAWLER = {
    # Default search settings
    "SEARCH_TERM": "software engineer",
    "MAX_RESULTS": 15,
    "HOURS_OLD": 72,
    "DISTANCE": 50,  # miles radius for local searches

    # Job sites to scrape
    "SITES": ["indeed", "linkedin", "zip_recruiter", "glassdoor"],

    # Location presets
    "LOCATION_COLUMBUS": "Columbus, OH",
    "LOCATION_REMOTE": "USA",

    # Job types: fulltime, parttime, internship, contract
    "JOB_TYPE": None,  # None = all types
}
