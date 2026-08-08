import requests
from typing import List, Dict, Any, Optional
from app.core.config import settings

def get_realtime_train_status(route: str) -> str:
    """Query live government train tracking API for route status."""
    try:
        url = f"{settings.TRAIN_API_URL}/tracking?route={route}"
        response = requests.get(url, timeout=4)
        if response.status_code == 200:
            data = response.json()
            return f"🚆 Live Status for {route}: {data.get('status', 'Running on time')}"
        else:
            return f"⚠️ Live Train API returned HTTP {response.status_code}."
    except Exception as e:
        print(f"Live train API error: {e}")
        return f"⚠️ Live train tracking service unavailable: {str(e)}"

def get_all_trains() -> Optional[List[Dict[str, Any]]]:
    """Fetch list of all available trains from train API, or None if offline."""
    try:
        response = requests.get(settings.TRAIN_API_URL, timeout=4)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Train API unavailable: {e}")
        return None

def get_train_name_by_id(train_id: str) -> str:
    """Map train ID to human readable train name."""
    trains = get_all_trains()
    if trains:
        for t in trains:
            if t.get("id") == train_id:
                return t.get("name", f"Train {train_id}")
    return f"Train #{train_id}"
