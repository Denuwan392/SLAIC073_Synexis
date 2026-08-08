from pydantic import BaseModel, Field
from typing import Optional

class QueryRequest(BaseModel):
    query: str = Field(..., description="User question or schedule query in Sinhala, Tamil, or English")

class ScheduleQueryRequest(BaseModel):
    query: str = Field(..., description="Query for schedules (e.g. Colombo to Kandy)")
    limit: Optional[int] = Field(default=10, description="Max results to return")
