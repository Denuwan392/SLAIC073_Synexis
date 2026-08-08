from fastapi import APIRouter, HTTPException
from app.services.train_service import get_realtime_train_status, get_train_name_by_id

router = APIRouter()

@router.get("/train-tracking/{train_id}")
def get_train_tracking(train_id: str):
    """Endpoint expected by Mobile client: GET /train-tracking/{train_id}"""
    try:
        train_name = get_train_name_by_id(train_id)
        status_msg = get_realtime_train_status(train_id)
        return {
            "train_id": train_id,
            "train_name": train_name,
            "status": status_msg,
            "is_live": "Live Status" in status_msg
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
