import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone

import boto3


ssm = boto3.client("ssm")
s3 = boto3.client("s3")

PARAMETER_NAME = "/portfolio/weather/openweather-api-key"
BUCKET_NAME = "adr.rpg"
OUTPUT_KEY = "data/weather.json"

CITY = os.environ.get("WEATHER_CITY", "Miami")
COUNTRY = os.environ.get("WEATHER_COUNTRY", "US")


def lambda_handler(event, context):
    parameter = ssm.get_parameter(
        Name=PARAMETER_NAME,
        WithDecryption=True
    )

    api_key = parameter["Parameter"]["Value"]

    query = urllib.parse.urlencode({
        "q": f"{CITY},{COUNTRY}",
        "appid": api_key,
        "units": "imperial"
    })

    url = f"https://api.openweathermap.org/data/2.5/weather?{query}"

    with urllib.request.urlopen(url, timeout=10) as response:
        weather = json.loads(response.read().decode("utf-8"))

    output = {
        "city": weather["name"],
        "country": weather["sys"]["country"],
        "temperature": round(weather["main"]["temp"]),
        "feels_like": round(weather["main"]["feels_like"]),
        "condition": weather["weather"][0]["main"],
        "description": weather["weather"][0]["description"].title(),
        "humidity": weather["main"]["humidity"],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=OUTPUT_KEY,
        Body=json.dumps(output),
        ContentType="application/json",
        CacheControl="max-age=300"
    )

    return {
        "statusCode": 200,
        "body": output
    }