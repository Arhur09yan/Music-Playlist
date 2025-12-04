from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SongBase(BaseModel):
    title: str
    artist: str
    # Denormalized album name from Spotify
    album: str
    genre: str
    duration: float
    url: str
    local_file_path: Optional[str] = None
    album_id: Optional[int] = None
    image_url: Optional[str] = None  # Album/cover image URL from Spotify


class SongCreate(SongBase):
    pass


class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    genre: Optional[str] = None
    album_id: Optional[int] = None


class SongResponse(SongBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
