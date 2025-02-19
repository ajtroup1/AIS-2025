import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

# Set up WebDriver
options = webdriver.ChromeOptions()
# options.add_argument("--headless")  # Run in background
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--start-maximized")

# Launch browser
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

BASE_URL = "https://www.indeed.com/jobs?q=software+engineer&l=New+York%2C+NY"

def scrape_indeed_jobs(params, pages=2):
    print("scraping indeed jobs...")
    """Scrape job listings from Indeed"""
    driver.get(BASE_URL)
    time.sleep(3)  # Wait for page to load

    all_jobs = []

    for page in range(pages):
        print(f"Scraping page {page + 1}...")
        time.sleep(3)

        job_cards = driver.find_elements(By.CLASS_NAME, "job_seen_beacon")
        print(f"Found {len(job_cards)} job cards.")
        
        for job in job_cards:
            try:
                title = job.find_element(By.CLASS_NAME, "jobTitle").text
                company = driver.find_element(By.XPATH, '//span[@data-testid="company-name"]').text
                if company in params["ignore"]:
                    continue
                location = driver.find_element(By.XPATH, '//div[@data-testid="text-location"]').text
                link = job.find_element(By.TAG_NAME, "a").get_attribute("href")

                all_jobs.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "link": link
                })
            except Exception as e:
                print("Skipping job:", e)

        # Try to go to the next page
        try:
            # time.sleep(9999)
            next_btn = driver.find_element(By.CSS_SELECTOR, '[aria-label="Next"]')
            driver.execute_script("arguments[0].click();", next_btn)
            time.sleep(3)  # Wait for next page to load
        except:
            print("No more pages available.")
            break

    driver.quit()
    return all_jobs